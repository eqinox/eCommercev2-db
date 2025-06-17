import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
  Patch
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, OmitType } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto'; 
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  private logger = new Logger('ProductsController');
  constructor(private productService: ProductsService) {}

  // Get all products
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all products for the authenticated user',
    type: [ProductResponseDto]
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  getProducts(
    @Query() filterDto: GetProductsFilterDto,
  ): Promise<ProductResponseDto[]> {
    this.logger.verbose(
      `retrieving all products. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.productService.getProducts(filterDto);
  }

  // Get a product by ID
  @Get('/:id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the product with the specified ID',
    type: ProductResponseDto
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.getProductById(id);
  }

  // Create a new product
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ 
    status: 201, 
    description: 'The product has been successfully created',
    type: ProductResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard())
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<ProductResponseDto> {
    this.logger.verbose(
      `User ${user.email} creating a new product. Data: ${JSON.stringify(createProductDto)}`,
    );
    return this.productService.createProduct(createProductDto, user);
  }

  // Delete a product
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ 
    status: 200, 
    description: 'The product has been successfully deleted',
    type: OmitType(ProductResponseDto, ['id'])
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(AuthGuard())
  deleteProduct(@Param('id') id: string, @GetUser() user: User): Promise<ProductResponseDto> {
    this.logger.verbose(
      `User "${user.email}" trying to delete product with id ${id}`,
    );
    return this.productService.deleteProduct(id, user);
  }

  // Update a product
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ 
    status: 200, 
    description: 'The product has been successfully updated.',
    type: ProductResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(AuthGuard())
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ): Promise<ProductResponseDto> {
    this.logger.verbose(
      `User "${user.email}" trying to update product with id ${id}. Data: ${JSON.stringify(updateProductDto)}`,
    );
    return this.productService.updateProduct(id, updateProductDto, user);
  }
} 