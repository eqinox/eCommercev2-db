import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, SizeDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './product-status.enum';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService', { timestamp: true });

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.findOne(id);

    return product;
  }

  async getProducts(filterDto: GetProductsFilterDto): Promise<ProductResponseDto[]> {
    const { search, status } = filterDto;

    const query = this.productRepository.createQueryBuilder('product');

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        {
          search: `%${search.toLowerCase()}%`,
        },
      );
    }

    try {
      const products = await query.getMany();
      return products;
    } catch (error) {
      this.logger.error(
        `Failed to get products. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  private calculateStock(sizes: SizeDto[]): number {
    return sizes.reduce((total, size) => total + size.quantity, 0);
  }

  private updateProductStatus(product: Product): void {
    product.stock = this.calculateStock(product.sizes);
    product.status = product.stock > 0 ? ProductStatus.IN_STOCK : ProductStatus.OUT_OF_STOCK;
  }

  async createProduct(createProductDto: CreateProductDto, user: User): Promise<ProductResponseDto> {
    const { name, description, price, sizes } = createProductDto;

    const product = this.productRepository.create({
      name,
      description,
      price,
      sizes,
      user,
    });

    this.updateProductStatus(product);
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async deleteProduct(id: string, user: User): Promise<ProductResponseDto> {
    const product = await this.findOne(id);
    
    if (product.user.id !== user.id) {
      throw new NotFoundException(`Unauthorized to delete product`);
    }

    const result = await this.productRepository.remove(product);
    return result;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, user: User): Promise<ProductResponseDto> {
    const { name, description, price, sizes } = updateProductDto;
    const product = await this.findOne(id);

    if (product.user.id !== user.id) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (sizes) product.sizes = sizes;

    this.updateProductStatus(product);
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async remove(id: string, user: User): Promise<ProductResponseDto> {
    const product = await this.findOne(id);

    if (product.user.id !== user.id) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const result = await this.productRepository.remove(product);
    return result;
  }
} 