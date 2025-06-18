/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { fullName, email, phone, password, confirmPassword } = dto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: 'user',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toLocaleString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedAt: user.updatedAt.toLocaleString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  }
}
