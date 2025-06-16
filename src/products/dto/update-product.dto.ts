import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ProductStatus } from '../product-status.enum';

export class UpdateProductDto {
  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product',
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: ProductStatus.IN_STOCK,
    description: 'The status of the product',
    enum: ProductStatus,
    required: false
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
} 