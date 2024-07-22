import { Column, Entity, PrimaryGeneratedColumn, Index ,OneToMany,OneToOne} from 'typeorm';

import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class UserEntity {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ['u', 'a'] })
  /**
   * u - user
   * r - admin
   */
  role: string;

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}

