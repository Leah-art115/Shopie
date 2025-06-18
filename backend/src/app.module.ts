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

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MailerModule, AuthModule, UserModule, PrismaModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
