import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { Product } from 'src/products/entities/product.entity';
import { RemoveCartItemDto } from './dto/remove-cartItem.dto';
import { UpdateCartItemDto } from './dto/update-cartItem.dto';
@Injectable()
export class CartService {

  constructor(@InjectRepository(Cart)
  private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,) { }

  async create(userID: number) {

    const user = await this.userRepository.findOne({ where: { id: userID } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newCart = this.cartRepository.create({
      user: user,
      createdAt: new Date(),
    });

    return this.cartRepository.save(newCart);

  }

  async addProductToCart(userId: number, createCartItemDto: CreateCartItemDto) {
    const { productId, quantity } = createCartItemDto;

    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let cart = user.cart;
    if (!cart) {
      cart = await this.create(userId);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if the product already exists in the cart
    const existingCartItem = await this.cartItemRepository.findOne({ where: { cart: cart, product: product } });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      existingCartItem.quantity += quantity;
      return this.cartItemRepository.save(existingCartItem);
    } else {
      // Create a new cart item
      const cartItem = this.cartItemRepository.create({
        cart: cart,
        product: product,
        quantity: quantity,
      });
      return this.cartItemRepository.save(cartItem);
    }

  }

  async deleteProductFromCart(userId: number, removeCartItemDto: RemoveCartItemDto): Promise<void> {
    const { productId } = removeCartItemDto;
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart'] });
    if (!user || !user.cart) {
      throw new NotFoundException('Cart not found for user');
    }

    const cartItem = await this.cartItemRepository.findOne({ where: { cart: user.cart, product: { id: productId } } });
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async updateProductQuantity(userId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {

    const { productId, quantity } = updateCartItemDto;

    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart'] });
    if (!user || !user.cart) {
      throw new NotFoundException('Cart not found for user');
    }

    const cartItem = await this.cartItemRepository.findOne({ where: { cart: user.cart, product: { id: productId } } });
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    cartItem.quantity = quantity;

    return this.cartItemRepository.save(cartItem);
  }

  async getAllCartItems(userId: number): Promise<CartItem[]> {

    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['cart', 'cart.cartItems', 'cart.cartItems.product'] });
    if (!user || !user.cart) {
      throw new Error('Cart not found for user');
    }

    return user.cart.cartItems;
  }

  findAll() {

    return `This action returns all cart`;
  }

  findOne(id: number) {

    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
