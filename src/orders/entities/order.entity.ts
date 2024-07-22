import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  status: string;

  @ManyToOne(() => UserEntity, user => user.orders)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => Cart, cart => cart.orders)
  @JoinColumn()
  cart: Cart;
}
