import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('place/:id')
  placeOrder(@Param('id') userId: number) {
    return this.ordersService.placeOrder(userId);
  }
  
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string): Promise<Order> {
    return this.ordersService.getOrderById(orderId);
  }

  @Patch(':orderId/cancel')
  async cancelOrder(@Param('orderId') orderId: string): Promise<Order> {
    return this.ordersService.cancelOrder(orderId);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;
    console.log(updateOrderStatusDto);
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string): Promise<Order> {
    return this.ordersService.deleteOrderById(orderId);
  }
}
