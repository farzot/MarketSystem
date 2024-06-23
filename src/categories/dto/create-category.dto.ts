import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateCategoryDto {
  @ApiProperty()
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  storeId: number;
}
