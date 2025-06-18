import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPassword: string;
}
