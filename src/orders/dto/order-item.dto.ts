import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field()
  quantity: number;
}
