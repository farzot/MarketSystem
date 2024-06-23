import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class OrderItem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  @Field(() => Order)
  order: Order;

  @ApiProperty()
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @ApiProperty()
  @Column()
  @Field()
  quantity: number;
}
