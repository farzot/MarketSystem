import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { AdminGuard } from '../common/guards/admin.guard';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.registration(createUserDto, res);
      res.json(result);
    } catch (error) {
      throw new HttpException(
        `Failed to register user: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginUserDto, res);
      res.json(result);
    } catch (error) {
      throw new HttpException(
        `Failed to login: ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const result = await this.authService.logout(refreshToken, res);
      res.json(result);
    } catch (error) {
      throw new HttpException(
        `Failed to logout: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const result = await this.authService.refreshToken(
        req.user.id,
        refreshToken,
        res,
      );
      res.json(result);
    } catch (error) {
      throw new HttpException(
        `Failed to refresh token: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
