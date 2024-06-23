import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateOrderItemDto {
  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  orderId?: number;
}
