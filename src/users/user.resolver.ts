import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findUserAll();
  }

  @Query(() => User)
  async findUserById(@Args('id') id: string): Promise<User> {
    const user = await this.usersService.findUserById(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Mutation(() => User)
  async updateUserById(
    @Args('id') id: string,
    @Args('updateData') updateData: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateUserById(+id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Mutation(() => String)
  async deleteUserById(@Args('id') id: string): Promise<String> {
    const result = await this.usersService.deleteUserById(+id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return `User with ID ${id} deleted successfully`;
  }

  @Mutation(() => User)
  async activateUserById(@Args('id') id: string): Promise<User> {
    const activatedUser = await this.usersService.activateUser(+id);
    if (!activatedUser) {
      throw new NotFoundException(`Inactive user with ID ${id} not found`);
    }
    return activatedUser;
  }
}
