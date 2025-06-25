import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { UpdateStockDto } from './dto/update-stock.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProductsWithStock();
  }

  @Patch('stock')
  updateStock(@Body() dto: UpdateStockDto) {
    return this.adminService.updateProductStock(dto);
  }

  @Delete('product/:productId')
  deleteProduct(@Param('productId') productId: number) {
    return this.adminService.deleteProduct(+productId);
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Patch('order/:orderId/confirm')
  confirmOrder(@Param('orderId') orderId: string) {
    return this.adminService.confirmOrder(+orderId);
  }

  @Patch('order/:orderId/cancel')
  cancelOrder(@Param('orderId') orderId: string) {
    return this.adminService.cancelOrder(+orderId);
  }

  @Get('messages')
  getAllMessages() {
    return this.adminService.getAllMessages();
  }
}
