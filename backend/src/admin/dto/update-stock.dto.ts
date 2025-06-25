/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsInt, IsPositive, Min } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @Min(1)
  categoryId: number;

  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  amount: number;
}
