import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './auth/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CartItem } from './cart/entities/cart-item.entity';
import { Cart } from './cart/entities/cart.entity';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';
import { OrderItem } from './orders/entities/order_items.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-damp-sun-a1vvdcup-pooler.ap-southeast-1.aws.neon.tech',
      port: 5432,
      password: '0wKRMJSP1GqV',
      username: 'vmkathe',
      entities: [UserEntity,CartItem,Cart,Order,Product,OrderItem],
      database: 'nestjs',
      synchronize: true,
      logging: true,
      ssl:true
    })
    ,AuthModule, ProductsModule, CartModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
