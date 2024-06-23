import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateOrderItemDto {
  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
