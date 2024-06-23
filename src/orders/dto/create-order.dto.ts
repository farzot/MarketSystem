import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/order.entity';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';
import { OrderItemDto } from './order-item.dto';

@InputType()
export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field()
  cashierId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field()
  storeId: number;

  @ApiProperty()
  @Field()
  total_amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Field()
  date: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @Field(() => [OrderItemDto])
  items: OrderItemDto[];
}
