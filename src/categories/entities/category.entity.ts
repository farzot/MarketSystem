import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Product } from '../../products/entities/product.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ApiProperty()
  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Store, (store) => store.categories)
  @Field(() => Store)
  store: Store;

  @OneToMany(() => Product, (product) => product.category)
  @Field(() => [Product])
  products: Product[];
}
