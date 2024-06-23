import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateStoreDto {
  @ApiProperty({
    description: 'The name of the store',
    example: 'Super Mart',
  })
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The location of the store',
    example: '123 Main Street, City',
  })
  @Field()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'The contact information of the store',
    example: '+1-234-567-890',
  })
  @Field()
  @IsNotEmpty()
  @IsString()
  contact: string;

  @ApiProperty({
    description: 'The ID of the admin user managing the store',
    example: 1,
    type: () => Int,
  })
  @Field(() => Int)
  @IsNotEmpty()
  adminId: number;
}
