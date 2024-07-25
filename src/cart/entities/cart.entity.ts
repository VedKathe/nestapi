import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => UserEntity, user => user.cart)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItems: CartItem[];

}
