/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerController } from './mailer.controller';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"Crochet Shop" <${config.get('EMAIL_USER')}>`,
        },
      }),
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
