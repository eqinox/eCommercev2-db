import { IsOptional } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  status?: string;
}
