/* eslint-disable prettier/prettier */
 /* eslint-disable prettier/prettier */
 import {
   Controller,
   Get,
   Query,
   Post,
   Body,
   BadRequestException,
 } from '@nestjs/common';
 import { MailerService } from './mailer.service';

 @Controller('mailer')
 export class MailerController {
   constructor(private readonly mailerService: MailerService) {}

   @Get('welcome')
   async sendWelcomeEmail(
     @Query('to') to: string,
     @Query('name') name: string,
   ) {
     if (!to || !name) throw new BadRequestException('Missing email or name');
     await this.mailerService.sendWelcomeEmail(to, name);
     return { message: 'Welcome email sent successfully' };
   }

   @Get('order')
   async notifyAdminOfNewOrder(
     @Query('userName') userName: string,
     @Query('product') product: string,
   ) {
     if (!userName || !product)
       throw new BadRequestException('Missing username or product');
     await this.mailerService.notifyAdminOfNewOrder(userName, product);
     return { message: 'Admin notified of new order' };
   }

   @Get('confirm')
   async notifyUserOfOrderConfirmation(
     @Query('to') to: string,
     @Query('product') product: string,
   ) {
     if (!to || !product)
       throw new BadRequestException('Missing email or product');
     await this.mailerService.notifyUserOfOrderConfirmation(to, product);
     return { message: 'User notified of order confirmation' };
   }

   @Post('contact')
   async notifyAdminOfContactMessage(
     @Body() body: { senderEmail: string; message: string },
   ) {
     const { senderEmail, message } = body;
     if (!senderEmail || !message)
       throw new BadRequestException('Missing senderEmail or message');
     await this.mailerService.notifyAdminOfContactMessage(senderEmail, message);
     return { message: 'Admin notified of contact message' };
   }
 }


