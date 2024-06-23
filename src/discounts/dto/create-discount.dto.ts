import { IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateDiscountDto {
  @ApiProperty({ type: () => Product })
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  discount_price: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;
}
