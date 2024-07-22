import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,CartItem,UserEntity,Product])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
