import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Field, ObjectType } from '@nestjs/graphql';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
}
@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  confirmPassword: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Field()
  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany((type) => Store, (store) => store.admin)
  @Field((type) => [Store])
  stores: Store[];
}
