import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,UserEntity,Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
