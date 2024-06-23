import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(user: User) {
    const payload = { id: user.id, isActive: user.isActive, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.usersService.findUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already registered');
    }
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(newUser);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.usersService.updateUserById(newUser.id, {
      hashedRefreshToken,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return {
      message: 'Registration successful',
      user: newUser,
      tokens,
    };
  }

  // async login(loginUserDto: LoginUserDto, res: Response) {
  //   const { email, password } = loginUserDto;
  //   console.log(email);
  //   console.log(password);
  //   const user = await this.usersService.findUserByEmail(email);
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   console.log('Salom2');

  //   const isMatch = await bcrypt.compare(password, user.confirmPassword);
  //   console.log(user.password);
  //   console.log(`password`, password);
  //   if (!isMatch) {
  //     throw new BadRequestException('Passwords do not match');
  //   }
  //   console.log('Salom3');

  //   const tokens = await this.getTokens(user);
  //   const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
  //   await this.usersService.updateUserById(user.id, { hashedRefreshToken });

  //   res.cookie('refresh_token', tokens.refreshToken, {
  //     maxAge: 15 * 24 * 60 * 60 * 1000,
  //     httpOnly: true,
  //   });

  //   return {
  //     message: 'User logged in successfully',
  //     user,
  //     tokens,
  //   };
  // }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<any> {

    const { email, password } = loginUserDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password);
    console.log(`user.password`, user.password);
    
    if (!isMatch) {
      throw new BadRequestException('Passwords do not match');
    }
    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.usersService.updateUserById(user.id, { hashedRefreshToken });

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      message: 'User logged in successfully',
      user,
      tokens,
    };
  }

  async logout(refreshToken: string, res: Response) {
    const userData = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!userData) {
      throw new BadRequestException('User not verified');
    }

    await this.usersService.updateUserById(userData.id, {
      hashedRefreshToken: null,
    });
    res.clearCookie('refresh_token');

    return {
      message: 'User logged out successfully',
    };
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

    if (userId !== decodedToken['id']) {
      throw new BadRequestException('User not verified');
    }
    console.log(`Salom 1`);
    
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new BadRequestException('User not found');
    }
    console.log(`Salom 2`);

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) {
      throw new ForbiddenException('User not verified');
    }
    console.log(`Salom 3`);

    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.usersService.updateUserById(user.id, { hashedRefreshToken });

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      message: 'User get new refresh token',
      user,
      tokens,
    };
  }
}
