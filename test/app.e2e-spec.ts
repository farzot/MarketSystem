import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from './../src/users/dto/create-user.dto';
import { UserRole } from './../src/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdUserId: number;
  const createUserDto: CreateUserDto = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: UserRole.ADMIN,
    isActive: true,
    hashedRefreshToken: null,
  };

  it('POST /users (create user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const user = response.body;
    expect(user).toHaveProperty('id');
    expect(user.name).toEqual(createUserDto.name);
    expect(user.email).toEqual(createUserDto.email);

    createdUserId = user.id;
  });

  it('GET /users (find all users)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    const users = response.body;
    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual(createUserDto.email);
  });

  it('GET /users/:id (find user by id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    const user = response.body;
    expect(user).toHaveProperty('id');
    expect(user.id).toEqual(createdUserId);
  });

  it('PUT /users/:id (update user)', async () => {
    const updateData = { name: 'Updated User' };

    const response = await request(app.getHttpServer())
      .put(`/users/${createdUserId}`)
      .send(updateData)
      .expect(200);

    const updatedUser = response.body;
    expect(updatedUser.name).toEqual(updateData.name);
  });

  it('DELETE /users/:id (delete user)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(404);
  });

  it('PUT /users/activate/:id (activate user)', async () => {
    const newUser = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const newUserId = newUser.body.id;
    await request(app.getHttpServer())
      .put(`/users/activate/${newUserId}`)
      .expect(200);

    const activatedUser = await request(app.getHttpServer())
      .get(`/users/${newUserId}`)
      .expect(200);

    expect(activatedUser.body.isActive).toBe(true);
  });
});
