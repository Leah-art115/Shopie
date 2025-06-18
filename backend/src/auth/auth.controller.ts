import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }
}
