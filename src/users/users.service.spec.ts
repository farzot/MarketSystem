import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: UserRole.ADMIN,
        isActive: true, // Add these fields
        hashedRefreshToken: null,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 7);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findUserAll();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserById', () => {
    it('should update and return the updated user', async () => {
      const updateData: Partial<User> = { name: 'Updated User' };
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const result = await service.updateUserById(1, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ ...mockUser, ...updateData });
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserById(1, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by id', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUserById(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('activateUser', () => {
    it('should activate an inactive user', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.activateUser(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: false },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        isActive: true,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return the user if already active', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.activateUser(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: false },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
