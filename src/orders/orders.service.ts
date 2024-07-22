import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Cart } from 'src/cart/entities/cart.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async placeOrder(userId: number, cartId: string): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const newOrder = this.orderRepository.create({
      user: user,
      cart: cart,
      createdAt: new Date(),
      status: 'pending', // or any default status you want
    });

    return this.orderRepository.save(newOrder);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'cart'] });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['user', 'cart'] });
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = 'canceled'; // or any status representing cancellation
    return this.orderRepository.save(order);
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
