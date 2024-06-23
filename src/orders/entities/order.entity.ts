import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from '../../stores/entities/store.entity';
import { ApiProperty } from '@nestjs/swagger';


export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

@Entity()
@ObjectType()
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ApiProperty()
  @Column()
  @Field()
  cashierId: number;

  @ApiProperty()
  @Column({ type: 'float', default: null })
  @Field()
  total_amount: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  @Field()
  payment_method: PaymentMethod;

  @ApiProperty()
  @Column({ type: 'date' })
  @Field()
  date: string;

  @ApiProperty()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @Field(() => [OrderItem])
  items: OrderItem[];

  @ApiProperty()
  @ManyToOne((type) => Store, (store) => store.orders)
  @Field((type) => Store)
  store: Store;
}
