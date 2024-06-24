import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new NotFoundException(`Failed to create user: ${error.message}`);
    }
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    try {
      return await this.usersService.findUserAll();
    } catch (error) {
      throw new NotFoundException(`Failed to fetch users: ${error.message}`);
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.usersService.findUserById(+id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`Failed to find user: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    try {
      const updatedUser = await this.usersService.updateUserById(
        +id,
        updateData,
      );
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`Failed to update user: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<String> {
    try {
      const result = await this.usersService.deleteUserById(+id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return `User with ID ${id} deleted successfully`;
    } catch (error) {
      throw new NotFoundException(`Failed to delete user: ${error.message}`);
    }
  }

  @Put('/activate/:id')
  async activateUserById(@Param('id') id: string): Promise<User> {
    try {
      const activatedUser = await this.usersService.activateUser(+id);
      if (!activatedUser) {
        throw new NotFoundException(`Inactive user with ID ${id} not found`);
      }
      return activatedUser;
    } catch (error) {
      throw new NotFoundException(`Failed to activate user: ${error.message}`);
    }
  }
}
