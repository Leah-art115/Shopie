/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../common/cloudinary.service';
import { Express } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(
    sellerId: number,
    dto: CreateProductDto,
    images: Express.Multer.File[],
  ) {
    const {
      name,
      description,
      price,
      stock,
      sale,
      salePrice,
      isHot,
      isNew,
      isTrending,
      categoryIds,
    } = dto;

    if (sale && !salePrice) {
      throw new BadRequestException(
        'Sale price must be provided when sale is true',
      );
    }

    const uploadedImageUrls: string[] = [];

    for (const image of images) {
      const buffer = image.buffer;
      const filename = `${Date.now()}-${image.originalname}`;
      const imageUrl = await this.cloudinaryService.uploadImage(buffer, filename);
      uploadedImageUrls.push(imageUrl);
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        sale,
        salePrice,
        isHot,
        isNew,
        isTrending,
        sellerId,
        categories: {
          create: categoryIds.map((id) => ({
            category: { connect: { id: +id } },
          })),
        },
        images: {
          create: uploadedImageUrls.map((url) => ({ url })),
        },
      },
    });

    return product;
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.isDeleted)
      throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        sale: dto.sale,
        salePrice: dto.salePrice,
        isHot: dto.isHot,
        isNew: dto.isNew,
        isTrending: dto.isTrending,
        categories: dto.categoryIds
          ? {
              deleteMany: {},
              create: dto.categoryIds.map((id) => ({
                category: { connect: { id: Number(id) } },
              })),
            }
          : undefined,
        images: dto.imageUrls
          ? {
              deleteMany: {},
              create: dto.imageUrls.map((url) => ({ url })),
            }
          : undefined,
      },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        categories: { include: { category: true } },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: { include: { category: true } },
        images: true,
      },
    });

    if (!product || product.isDeleted)
      throw new NotFoundException('Product not found');
    return product;
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

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(name: string) {
    const existing = await this.prisma.category.findUnique({ where: { name } });
    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: { name },
    });
  }

  async deleteCategory(categoryId: number) {
    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async deleteProductImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }
}
