import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { RemoveCartItemDto } from './dto/remove-cartItem.dto';
import { UpdateCartItemDto } from './dto/update-cartItem.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(+id);
  }

  @Post('addItem/:id')
  addItemToCart(@Param('id') id: string, @Body() createCartItemDto: CreateCartItemDto){
    return this.cartService.addProductToCart(+id,createCartItemDto)
  }

  @Delete('removeItem/:id')
  removeItemToCart(@Param('id') id: string, @Body() removeCartItemDto: RemoveCartItemDto){
    return this.cartService.deleteProductFromCart(+id,removeCartItemDto)
  }

  @Patch('updateItem/:id')
  updateItemToCart(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto)  {
    return this.cartService.updateProductQuantity(+id,updateCartItemDto)
  }

  @Get('getItems/:userId')
  findAll(@Param('userId') id: string) {
    return this.cartService.getAllCartItems(+id);
  }


}
