/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CloudinaryService } from './common/cloudinary.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MailerModule, AuthModule, UserModule, PrismaModule, AdminModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
   exports: [CloudinaryService],
})
export class AppModule {}
