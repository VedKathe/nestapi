import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { OrderItem } from './order_items.entity';

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

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true, onDelete: 'CASCADE' })
  orderItems: OrderItem[];
}
