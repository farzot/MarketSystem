import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
  })
  @Field({ nullable: true })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'password123',
    minLength: 6,
  })
  @Field({ nullable: true })
  @IsString()
  @MinLength(6)
  @IsOptional()
  confirmPassword: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  role: UserRole;
}
