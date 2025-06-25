/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async getAllProductsWithStock() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        categories: { include: { category: true } },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProductStock(dto: UpdateStockDto) {
    const { categoryId, productId, amount } = dto;

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        isDeleted: false,
        categories: {
          some: {
            categoryId: categoryId,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found for this category');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock + amount },
    });
  }

  async deleteProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.isDeleted)
      throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirmOrder(orderId: number) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
      include: { user: true },
    });

    await this.mailerService.sendOrderConfirmationEmail(order.user.email);
    return order;
  }

  async cancelOrder(orderId: number) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { user: true },
    });

    await this.mailerService.sendOrderCancellationEmail(order.user.email);
    return order;
  }

  async getAllMessages() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
