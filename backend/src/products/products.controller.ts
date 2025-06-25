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
  Query,
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

  // New search endpoint
  @Get('search')
  searchProducts(@Query('search') searchQuery: string) {
    if (!searchQuery || searchQuery.trim() === '') {
      throw new BadRequestException('Search query is required');
    }
    return this.productsService.searchProducts(searchQuery.trim());
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) throw new BadRequestException('Invalid product ID');
    return this.productsService.getProductById(productId);
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

  @Get('hot')
  getHotProducts() {
    return this.productsService.getHotProducts();
  }

  @Get('new')
  getNewProducts() {
    return this.productsService.getNewProducts();
  }

  @Get('trending')
  getTrendingProducts() {
    return this.productsService.getTrendingProducts();
  }
}
