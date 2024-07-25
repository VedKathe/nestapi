import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Cart } from 'src/cart/entities/cart.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { OrderItem } from './entities/order_items.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) { }

  async placeOrder(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } ,relations:['cart']});
  if (!user) {
    throw new NotFoundException('User not found');
  }

const cartId= user.cart.id

  const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems', 'cartItems.product'] });
  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  // Check product stock
  for (const cartItem of cart.cartItems) {
    if (cartItem.product.stock < cartItem.quantity) {
      throw new Error(`Insufficient stock for product ${cartItem.product.name}`);
    }
  }

  // Create the order first
  const newOrder = this.orderRepository.create({
    user: user,
    createdAt: new Date(),
    status: 'pending', // or any default status you want
  });

  const savedOrder = await this.orderRepository.save(newOrder);

  // Deduct stock and create order items
  const orderItems = [];
  for (const cartItem of cart.cartItems) {
    cartItem.product.stock -= cartItem.quantity;
    await this.productRepository.save(cartItem.product);

    const orderItem = this.orderItemRepository.create({
      order: savedOrder,
      product: cartItem.product,
      quantity: cartItem.quantity,
    });

    const savedOrderItem = await this.orderItemRepository.save(orderItem);
    orderItems.push(savedOrderItem);
  }

  // Update the order with the saved order items
  savedOrder.orderItems = orderItems;
  await this.orderRepository.save(savedOrder);

  // Remove items from the cart after the order is placed
  for (const cartItem of cart.cartItems) {
    await this.cartItemRepository.remove(cartItem);
  }

  return savedOrder;
  }


  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'orderItems','orderItems.product'] });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['user', 'orderItems','orderItems.product'] });
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

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({where: {id: orderId}});
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }

  async deleteOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } ,relations:['orderItems']});
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderItemRepository.remove(order.orderItems);
    return await this.orderRepository.remove(order);
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
