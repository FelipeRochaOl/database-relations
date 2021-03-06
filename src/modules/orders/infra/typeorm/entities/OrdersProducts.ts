import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => Order, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  product_id: string;

  @ManyToOne(() => Product, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  price: number;

  @Column('integer')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
