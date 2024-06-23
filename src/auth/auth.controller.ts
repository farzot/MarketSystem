import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { AdminGuard } from '../common/guards/admin.guard';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.registration(createUserDto, res);
    res.json(result);
  }

  // @UseGuards(AdminGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.login(loginUserDto, res);
    res.json(result);
  }

  // @UseGuards()
  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const result = await this.authService.logout(refreshToken, res);
    res.json(result);
  }

  // @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const result = await this.authService.refreshToken(
      req.user.id,
      refreshToken,
      res,
    );
    res.json(result);
  }
}
