import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Cart, cart => cart.cartItems)
  @JoinColumn()
  cart: Cart;

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn()
  product: Product;
}
