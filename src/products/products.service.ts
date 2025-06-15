import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from '../tasks/dto/get-tasts-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService', { timestamp: true });

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductById(id: string, user: User): Promise<Product> {
    const found = await this.productRepository.findOne({
      where: {
        id: id,
        user,
      },
    });

    if (!found) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return found;
  }

  async getProducts(filterDto: GetProductsFilterDto, user: User): Promise<Product[]> {
    const { search } = filterDto;

    const query = this.productRepository.createQueryBuilder('product');
    query.where({ user });

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
        `Failed to get products for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createProduct(createProductDto: CreateProductDto, user: User): Promise<Product> {
    const { title, description } = createProductDto;
    const product = this.productRepository.create({
      title,
      description,
      user,
    });

    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: string, user: User): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" trying to delete product with id ${id}`,
    );
    const result = await this.productRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
} 