import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../product-status.enum'; 

export class ProductResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the product'
  })
  id: string;

  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product'
  })
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product'
  })
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product'
  })
  price: number;

  @ApiProperty({
    example: ProductStatus.IN_STOCK,
    description: 'The current status of the product',
    enum: ProductStatus
  })
  status: ProductStatus;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the product was created'
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the product was last updated'
  })
  updated_at: Date;
} 