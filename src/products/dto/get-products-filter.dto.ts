import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from '../product-status.enum';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
} 