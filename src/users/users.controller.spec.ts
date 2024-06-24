import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    confirmPassword: 'hashedPassword',
    isActive: true,
    role: UserRole.ADMIN,
    hashedRefreshToken: null,
    stores: [],
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findUserAll: jest.fn().mockResolvedValue([mockUser]),
    findUserById: jest.fn().mockResolvedValue(mockUser),
    updateUserById: jest.fn().mockResolvedValue(mockUser),
    deleteUserById: jest.fn().mockResolvedValue({ affected: 1 }),
    activateUser: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: UserRole.ADMIN,
        isActive: true, // Add these fields
        hashedRefreshToken: null,
      };

      expect(await controller.createUser(createUserDto)).toEqual(mockUser);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAllUsers()).toEqual([mockUser]);
      expect(service.findUserAll).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      expect(await controller.findUserById('1')).toEqual(mockUser);
      expect(service.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValueOnce(null);

      await expect(controller.findUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserById', () => {
    it('should update a user by id', async () => {
      const updateData = { name: 'Updated User' };

      expect(await controller.updateUserById('1', updateData)).toEqual(
        mockUser,
      );
      expect(service.updateUserById).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'updateUserById').mockResolvedValueOnce(null);

      await expect(controller.updateUserById('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by id', async () => {
      expect(await controller.deleteUserById('1')).toEqual(
        'User with ID 1 deleted successfully',
      );
      expect(service.deleteUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(service, 'deleteUserById')
        .mockResolvedValueOnce({ affected: 0 });

      await expect(controller.deleteUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activateUserById', () => {
    it('should activate a user by id', async () => {
      expect(await controller.activateUserById('1')).toEqual(mockUser);
      expect(service.activateUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'activateUser').mockResolvedValueOnce(null);

      await expect(controller.activateUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
