import { Entity, PrimaryGeneratedColumn, Column, OneToMany,Index } from 'typeorm';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from 'src/orders/entities/order_items.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  productid:string

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  category: string;

  @Column('int')
  stock: number;

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];
}
