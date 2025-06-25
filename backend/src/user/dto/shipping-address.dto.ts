import { IsString } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  region: string;

  @IsString()
  county: string;

  @IsString()
  subcounty: string;

  @IsString()
  town: string;
}
