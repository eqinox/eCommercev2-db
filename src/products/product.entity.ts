import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from './product-status.enum';
import { SizeDto } from './dto/create-product.dto';

@Entity()
export class Product {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the product',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product',
  })
  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.IN_STOCK
  })
  status: ProductStatus;

  @ApiProperty({
    example: [
      { size: "S", quantity: 2 },
      { size: "M", quantity: 3 },
      { size: "L", quantity: 1 }
    ],
    description: 'The available sizes and quantities of the product',
  })
  @Column('jsonb')
  sizes: SizeDto[];

  @ApiProperty({
    example: 10,
    description: 'The total stock quantity of the product',
  })
  @Column({ default: 0 })
  stock: number;

  @ApiProperty({
    type: () => User,
    description: 'The user who owns this product',
  })
  @ManyToOne((type) => User, (user) => user.products, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 