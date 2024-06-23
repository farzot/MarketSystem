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
import { UpdateOrderItemDto } from '../../order-items/dto/update-order-item.dto'; // Adjust based on your actual DTO

@InputType()
export class UpdateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field({ nullable: true }) // Nullable because it's optional in update
  cashierId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field()
  storeId?: number;

  @ApiProperty()
  @Field({ nullable: true }) // Nullable because it's optional in update
  total_amount?: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod, { nullable: true }) // Nullable because it's optional in update
  payment_method?: PaymentMethod;

  @ApiProperty()
  @IsDateString()
  @Field({ nullable: true }) // Nullable because it's optional in update
  date?: string;

  @ApiProperty({ type: [UpdateOrderItemDto] }) // Adjust based on your actual DTO
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @Field(() => [UpdateOrderItemDto], { nullable: true }) // Nullable because it's optional in update
  items?: UpdateOrderItemDto[];
}
