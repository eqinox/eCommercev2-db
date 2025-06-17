import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min, IsArray, ValidateNested, IsIn, ArrayMinSize, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../product-status.enum';
import { SizeDto } from './create-product.dto';

const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export class UpdateProductDto {
  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    example: [
      { size: "S", quantity: 2 },
      { size: "M", quantity: 3 },
      { size: "L", quantity: 1 }
    ],
    description: 'The available sizes and quantities of the product. Each size must be one of: S, M, L, XL, XXL, XXXL. At least one size is required.',
    required: false,
    type: [SizeDto]
  })
  @IsOptional()
  @IsArray({ message: 'Sizes must be an array of size objects' })
  @ArrayMinSize(1, { message: 'At least one size must be provided' })
  @ValidateNested({ 
    each: true,
    message: 'Each size object must have a valid size (S, M, L, XL, XXL, XXXL) and a positive quantity'
  })
  @Type(() => SizeDto)
  sizes?: SizeDto[];
} 