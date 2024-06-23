import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator

@Entity()
@ObjectType()
export class Product {
  @ApiProperty()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Field({ nullable: true })
  @Column()
  name: string;

  @ApiProperty()
  @Field()
  @Column()
  description: string;

  @ApiProperty()
  @Field()
  @Column()
  cost_price: number;

  @ApiProperty()
  @Field({ nullable: true })
  @Column({ nullable: true, default: null })
  sold_amount: number;

  @ApiProperty()
  @Field()
  @Column()
  sale_price: number;

  @ApiProperty()
  @Field({ nullable: true })
  @Column({ nullable: true, default: null })
  original_sale_price: number;

  @ApiProperty()
  @Field()
  @Column()
  amount: number;

  @ApiProperty()
  @Field()
  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  @Field(() => Category)
  category: Category;

  @ManyToOne(() => Store, (store) => store.products, {lazy: true})
  @Field(() => Store)
  store: Store;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @OneToMany(() => Discount, (discount) => discount.product)
  @Field(() => [Discount])
  discounts: Discount[];
}
