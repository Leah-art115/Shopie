/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.createEmailTransporter();
  }

  private createEmailTransporter() {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');

    this.logger.log(`Setting up email with user: ${emailUser ? 'SET' : 'NOT SET'}`);
    this.logger.log(`Email password: ${emailPass ? 'SET' : 'NOT SET'}`);

    if (!emailUser || !emailPass) {
      this.logger.error('Email credentials not properly configured!');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      debug: true,
      logger: true,
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email transporter verification failed:', error);
      } else {
        this.logger.log('Email transporter is ready to send emails');
      }
    });
  }

  private async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    this.logger.log(`Attempting to send welcome email to: ${email}`);

    if (!this.transporter) {
      this.logger.error('Email transporter not initialized');
      return;
    }

    try {
      const welcomeEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Our Platform! </h1>
            <p>We're excited to have you on board</p>
          </div>
          
          <div class="content">
            <h2>Hello ${fullName}! </h2>
            
            <p>Thank you for registering with us! We're thrilled to welcome you to our community.</p>
            
            <p>Here's what you can expect:</p>
            <ul>
              <li>Access to all our amazing features</li>
              <li>Personalized experience tailored just for you</li>
              <li>Regular updates about new features</li>
              <li>Exclusive offers and early access</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200'}/home" class="button">
                Get Started
              </a>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Welcome aboard! </p>
            
            <p>Best regards,<br>The Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject: 'Welcome to Our Platform! ',
        html: welcomeEmailHtml,
      };

      this.logger.log(`Sending email from: ${mailOptions.from} to: ${mailOptions.to}`);

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent successfully to ${email}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      if (error.code) {
        this.logger.error(`Error code: ${error.code}`);
      }
      if (error.response) {
        this.logger.error(`Error response: ${error.response}`);
      }
    }
  }

  async register(dto: RegisterDto) {
    const { fullName, email, phone, password, confirmPassword } = dto;

    this.logger.log(`Registration attempt for email: ${email}`);

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role: Role.USER,
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

    this.logger.log(`User created successfully: ${user.email}`);

    this.sendWelcomeEmail(user.email, user.fullName).catch(error => {
      this.logger.error('Welcome email failed:', error);
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
