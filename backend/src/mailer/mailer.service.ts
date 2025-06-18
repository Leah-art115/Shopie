/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  sendOrderNotificationToAdmin(product: string, buyer: string) {
    throw new Error('Method not implemented.');
  }
  sendOrderConfirmation(to: string, product: string) {
    throw new Error('Method not implemented.');
  }
  notifyAdminOfBuyerMessage(from: string, message: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  private getAdminEmail(): string {
    const adminEmail = this.configService.get<string>('EMAIL_USER');
    if (!adminEmail) {
      throw new InternalServerErrorException('EMAIL_USER is not defined in environment variables');
    }
    return adminEmail;
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Crochet Shop!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Welcome to <strong>Crochet Shop</strong>!</p>
        <p>We’re so glad you’re here. Browse our handmade items and find something you’ll love.</p>
        <br/>
        <p>Happy shopping,</p>
        <p>The Crochet Shop Team</p>
      `,
    });
  }

  async notifyAdminOfNewOrder(userName: string, product: string): Promise<void> {
    const adminEmail = this.getAdminEmail();
    await this.mailerService.sendMail({
      to: adminEmail,
      subject: 'New Order Placed',
      html: `
        <h2>Hello Admin,</h2>
        <p><strong>${userName}</strong> just placed an order for <strong>${product}</strong>.</p>
        <p>Please confirm the order to proceed with shipment.</p>
      `,
    });
  }

  async notifyUserOfOrderConfirmation(to: string, product: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Order Confirmed',
      html: `
        <h2>Your Order Is Confirmed!</h2>
        <p>Your order for <strong>${product}</strong> has been confirmed and will be shipped shortly.</p>
        <p>Thanks for shopping with Crochet Shop!</p>
      `,
    });
  }

  async notifyAdminOfContactMessage(senderEmail: string, message: string): Promise<void> {
    const adminEmail = this.getAdminEmail();
    await this.mailerService.sendMail({
      to: adminEmail,
      subject: 'New Message from a User',
      html: `
        <h2>Contact Message</h2>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
  }
}
