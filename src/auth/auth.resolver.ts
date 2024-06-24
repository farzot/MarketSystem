import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(
    @Args('createUserData') createUserData: CreateUserDto,
    @Res() res: Response,
  ) {
    return this.authService.registration(createUserData, res);
  }

  @Mutation(() => User)
  async login(
    @Args('loginUserData') loginUserData: LoginUserDto,
    @Res() res: Response,
  ){
    return this.authService.login(loginUserData,res);
  }

  @Mutation(() => String)
  async logout(
    @Args('refreshToken') refreshToken: string,
    @Res() res: Response,
  ){
    return this.authService.logout(refreshToken,res);
  }

  @Mutation(() => User)
  async refresh(
    @Args('userId') userId: number,
    @Args('refreshToken') refreshToken: string,
    @Res() res: Response,
  ){
    return this.authService.refreshToken(userId, refreshToken, res);
  }
}
