import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @Field(() => Int, { nullable: true })
  @IsNumber()
  storeId?: number;
}
