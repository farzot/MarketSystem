import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateProductDto {
  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  sale_price?: number;

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

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  storeId?: number;
}
