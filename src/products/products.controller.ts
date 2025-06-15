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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from '../tasks/dto/get-tasts-filter.dto';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
  private logger = new Logger('ProductsController');
  constructor(private productService: ProductsService) {}

  @Get()
  getProducts(
    @Query() filterDto: GetProductsFilterDto,
    @GetUser() user: User,
  ): Promise<Product[]> {
    this.logger.verbose(
      `User "${user.email}" retrieving all products. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.productService.getProducts(filterDto, user);
  }

  @Get('/:id')
  getProductById(@Param('id') id: string, @GetUser() user: User): Promise<Product> {
    return this.productService.getProductById(id, user);
  }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    this.logger.verbose(
      `User ${user.email} creating a new product. Data: ${JSON.stringify(createProductDto)}`,
    );
    return this.productService.createProduct(createProductDto, user);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.productService.deleteProduct(id, user);
  }
} 