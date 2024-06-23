import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator

@Entity()
@ObjectType()
export class Store {
  @PrimaryGeneratedColumn()
  @Field()
  @ApiProperty()
  id: number;

  @Column()
  @Field()
  @ApiProperty()
  name: string;

  @Column()
  @Field()
  @ApiProperty()
  location: string;

  @Column()
  @Field()
  @ApiProperty()
  contact: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.stores, { lazy: true })
  @Field(() => User)
  admin: User;

  @ApiProperty({ type: () => [Category] })
  @OneToMany(() => Category, (category) => category.store)
  @Field(() => [Category], { nullable: true })
  categories: Category[];

  @ApiProperty({ type: () => [Product] })
  @OneToMany(() => Product, (product) => product.store)
  @Field(() => [Product], { nullable: true })
  products: Product[];

  @ApiProperty({ type: () => [Order] })
  @OneToMany(() => Order, (order) => order.store  )
  @Field(() => [Order], { nullable: true })
  orders: Order[];
}
