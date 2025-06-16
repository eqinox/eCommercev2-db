import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../product-status.enum';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 13 Pro',
    description: 'The name of the product'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product'
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
} 