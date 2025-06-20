/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RequestWithUser } from '../common/types/request-with-user';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Req() req: RequestWithUser,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() dto: CreateProductDto,
  ) {
    const { user } = req;
    return this.productsService.createProduct(+user!.userId, dto, images);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, dto);
  }

  @Get()
  findAll() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.getProductById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }

  @Get('/categories/all')
  getAllCategories() {
    return this.productsService.getAllCategories();
  }

  @Post('/categories')
  createCategory(@Body() body: { name: string }) {
    return this.productsService.createCategory(body.name);
  }

  @Delete('/categories/:categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.deleteCategory(+categoryId);
  }

  @Delete('image/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.deleteProductImage(+imageId);
  }
}
