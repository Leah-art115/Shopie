import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsBoolean()
  @IsOptional()
  sale?: boolean;

  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsUUID(undefined, { each: true })
  categoryIds: string[];
}
