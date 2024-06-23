import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Discount {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Product, (product) => product.discounts, {lazy: true})
  @Field(() => Product)
  product: Product;

  @Column()
  @Field()
  discount_price: number;

  @Column()
  @Field()
  start_date: Date;

  @Column()
  @Field()
  end_date: Date;
  
}
