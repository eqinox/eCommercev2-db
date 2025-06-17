import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../auth/user.entity';
import { ProductStatus } from './product-status.enum';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

describe('ProductsService Integration', () => {
  let productsService: ProductsService;
  let authService: AuthService;
  let testUser: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.stage.test'],
          isGlobal: true
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT!,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [Product, User],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Product, User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [ProductsService, AuthService],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    authService = module.get<AuthService>(AuthService);

    // Create a test user for product operations
    testUser = await authService.createUser({
      email: 'test@test.com',
      password: 'Test123!',
      username: 'testuser'
    });
  }, 30000);

  afterAll(async () => {
    // Add cleanup if needed
  });

  it('should create a new product', async () => {
    const product = await productsService.createProduct({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sizes: [
        { size: 'S', quantity: 5 },
        { size: 'M', quantity: 5 },
        { size: 'L', quantity: 5 }
      ]
    }, testUser);

    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test Description');
    expect(product.price).toBe(99.99);
    expect(product.sizes).toHaveLength(3);
    expect(product.stock).toBe(15);
    expect(product.status).toBe(ProductStatus.IN_STOCK);
  });

  it('should get all products', async () => {
    // Create multiple products
    await productsService.createProduct({
      name: 'Product 1',
      description: 'Description 1',
      price: 49.99,
      sizes: [{ size: 'M', quantity: 3 }]
    }, testUser);

    await productsService.createProduct({
      name: 'Product 2',
      description: 'Description 2',
      price: 79.99,
      sizes: [{ size: 'L', quantity: 2 }]
    }, testUser);

    const products = await productsService.getProducts({});
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get a product by id', async () => {
    const createdProduct = await productsService.createProduct({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sizes: [{ size: 'M', quantity: 5 }]
    }, testUser);

    const product = await productsService.getProductById(createdProduct.id);
    expect(product).toBeDefined();
    expect(product.id).toBe(createdProduct.id);
    expect(product.name).toBe('Test Product');
  });

  it('should update a product', async () => {
    const createdProduct = await productsService.createProduct({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sizes: [{ size: 'M', quantity: 5 }]
    }, testUser);

    const updatedProduct = await productsService.updateProduct(
      createdProduct.id,
      {
        name: 'Updated Product',
        sizes: [{ size: 'M', quantity: 0 }]
      },
      testUser
    );

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.id).toBe(createdProduct.id);
    expect(updatedProduct.name).toBe('Updated Product');
    expect(updatedProduct.stock).toBe(0);
    expect(updatedProduct.status).toBe(ProductStatus.OUT_OF_STOCK);
  });

  it('should delete a product', async () => {
    const createdProduct = await productsService.createProduct({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      sizes: [{ size: 'M', quantity: 5 }]
    }, testUser);

    await productsService.deleteProduct(createdProduct.id, testUser);

    // Try to get the deleted product
    const product = await productsService.getProductById(createdProduct.id).catch(err => err);
    expect(product).not.toHaveProperty('id');
  });
}); 