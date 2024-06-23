import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findUserAll();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findUserById(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateUserById(+id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<String> {
    const result = await this.usersService.deleteUserById(+id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return `User with ID ${id} deleted successfully`;
  }

  @Put('/activate/:id')
  async activateUserById(@Param('id') id: string): Promise<User> {
    const activatedUser = await this.usersService.activateUser(+id);
    if (!activatedUser) {
      throw new NotFoundException(`Inactive user with ID ${id} not found`);
    }
    return activatedUser;
  }
}
