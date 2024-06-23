import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateProductDto {
  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  cost_price: number;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  sale_price: number;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  sold_amount?: number;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  original_sale_price?: number;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  storeId: number;
}
