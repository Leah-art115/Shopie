/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RequestWithUser } from '../common/types/request-with-user';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ShippingAddressDto } from './dto/shipping-address.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ReviewProductDto } from './dto/review-product.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.userService.getProfile(+user!.userId);
  }

  @Post('update-profile')
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    const { user } = req;
    return this.userService.updateProfile(+user!.userId, dto);
  }

  @Post('set-shipping-address')
  setShippingAddress(
    @Req() req: RequestWithUser,
    @Body() dto: ShippingAddressDto,
  ) {
    const { user } = req;
    return this.userService.setShippingAddress(+user!.userId, dto);
  }

  @Post('cart/add/:productId')
  addToCart(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
  ) {
    const { user } = req;
    return this.userService.addToCart(+user!.userId, productId);
  }

  @Post('cart/remove/:productId')
  removeFromCart(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
  ) {
    const { user } = req;
    return this.userService.removeFromCart(+user!.userId, productId);
  }

  @Get('cart/view')
  viewCart(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.userService.viewCart(+user!.userId);
  }

  @Post('like/:productId')
  likeProduct(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
  ) {
    const { user } = req;
    return this.userService.likeProduct(+user!.userId, productId);
  }

  @Post('unlike/:productId')
  unlikeProduct(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
  ) {
    const { user } = req;
    return this.userService.unlikeProduct(+user!.userId, productId);
  }

  @Get('liked')
  getLikedProducts(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.userService.getLikedProducts(+user!.userId);
  }

  @Post('contact-seller')
  contactSeller(@Req() req: RequestWithUser, @Body() dto: any) {
    const { user } = req;
    return this.userService.contactSeller(+user!.userId, dto);
  }

  @Post('order/:productId')
  placeOrder(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
  ) {
    const { user } = req;
    return this.userService.placeOrder(+user!.userId, productId);
  }

  @Post('reset-password')
  resetPassword(@Req() req: RequestWithUser, @Body() dto: ResetPasswordDto) {
    const { user } = req;
    return this.userService.resetPassword(+user!.userId, dto);
  }

  // Submit a product review
  @Post('review/:productId')
  reviewProduct(
    @Req() req: RequestWithUser,
    @Param('productId') productId: number,
    @Body() dto: ReviewProductDto,
  ) {
    const { user } = req;
    return this.userService.reviewProduct(+user!.userId, productId, dto);
  }

  // Get reviews for a product
  @Get('reviews/:productId')
  getProductReviews(@Param('productId') productId: number) {
    return this.userService.getProductReviews(productId);
  }
}
