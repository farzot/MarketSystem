import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

@InputType()
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @Field()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
  })
  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'password123',
    minLength: 6,
  })
  @Field()
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @Field()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    required: false,
  })
  @Field()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'The hashed refresh token',
    example: 'somehashedtoken',
    required: false,
  })
  hashedRefreshToken: string;
}
