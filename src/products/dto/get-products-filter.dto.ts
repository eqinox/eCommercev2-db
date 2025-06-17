import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../product-status.enum';

export class GetProductsFilterDto {
  @ApiProperty({
    enum: ProductStatus,
    required: false,
    description: 'Filter products by status',
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    required: false,
    description: 'Search products by name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;
} 