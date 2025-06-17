import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsArray, ValidateNested, Min, IsIn, ArrayMinSize, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../product-status.enum';

const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export class SizeDto {
  @ApiProperty({
    example: 'S',
    description: 'The size of the product',
    enum: VALID_SIZES
  })
  @IsString({ message: 'Size must be a string' })
  @IsIn(VALID_SIZES, { message: 'Size must be one of: S, M, L, XL, XXL, XXXL' })
  size: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity available for this size',
    minimum: 0
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be a positive number' })
  @Type(() => Number)
  quantity: number;
}

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: [
      { size: "S", quantity: 2 },
      { size: "M", quantity: 3 },
      { size: "L", quantity: 1 }
    ],
    description: 'The available sizes and quantities of the product. Each size must be one of: S, M, L, XL, XXL, XXXL. At least one size is required.',
    type: [SizeDto]
  })
  @IsArray({ message: 'Sizes must be an array of size objects' })
  @ArrayMinSize(1, { message: 'At least one size must be provided' })
  @ValidateNested({ 
    each: true,
    message: 'Each size object must have a valid size (S, M, L, XL, XXL, XXXL) and a positive quantity'
  })
  @Type(() => SizeDto)
  sizes: SizeDto[];
} 