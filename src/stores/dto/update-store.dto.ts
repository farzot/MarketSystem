import { IsOptional, IsString } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateStoreDto {
  @ApiProperty({
    description: 'The name of the store',
    example: 'Updated Super Mart',
  })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The location of the store',
    example: '456 Second Street, City',
  })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'The contact information of the store',
    example: '+1-987-654-321',
  })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'The ID of the admin user managing the store',
    example: 2,
    type: () => Int,
  })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  adminId?: number;
}
