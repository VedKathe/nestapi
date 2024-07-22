import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @Column()
  createdAt: Date;

  @Column()
  status: string;

  @ManyToOne(() => UserEntity, user => user.orders)
  user: UserEntity;

  @ManyToOne(() => Cart, cart => cart.orders)
  cart: Cart;
}
