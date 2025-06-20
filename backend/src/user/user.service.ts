/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslnumber-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ShippingAddressDto } from './dto/shipping-address.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ReviewProductDto } from './dto/review-product.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  async setShippingAddress(userId: number, dto: ShippingAddressDto) {
    return this.prisma.shippingAddress.upsert({
      where: { userId },
      create: { ...dto, userId },
      update: dto,
    });
  }

  async getShippingAddress(userId: number) {
    return this.prisma.shippingAddress.findUnique({
      where: { userId },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchProducts(query: number) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: String(query),
          mode: 'insensitive',
        },
      },
    });
  }

  async addToCart(userId: number, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock < 1)
      throw new BadRequestException('Product not available');

    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: 1 } },
    });

    return this.prisma.cart.create({
      data: { userId, productId },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    await this.prisma.cart.deleteMany({
      where: { userId, productId },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: 1 } },
    });

    return { message: 'Product removed from cart' };
  }

  async viewCart(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async likeProduct(userId: number, productId: number) {
    return this.prisma.likedProduct.create({
      data: { userId, productId },
    });
  }

  async unlikeProduct(userId: number, productId: number) {
    await this.prisma.likedProduct.deleteMany({
      where: { userId, productId },
    });
    return { message: 'Product unliked' };
  }

  async getLikedProducts(userId: number) {
    return this.prisma.likedProduct.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async contactSeller(
    userId: number,
    dto: { productId: number; message: number },
  ) {
    const { productId, message } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product || !product.seller) {
      throw new NotFoundException('Seller not found');
    }

    return { message: 'Your message has been sent to the seller.' };
  }

  async placeOrder(userId: number, productId: number) {
    return this.prisma.order.create({
      data: { userId, productId, status: 'pending' },
    });
  }

  async resetPassword(userId: number, dto: ResetPasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
      },
    });
  }

  async reviewProduct(
    userId: number,
    productId: number,
    dto: ReviewProductDto,
  ) {
    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async getProductReviews(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
