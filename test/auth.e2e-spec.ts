import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '~/app.module';
import { LoginRequestDto, RegisterRequestDto } from '~/auth/dtos/request';
import { User } from '~/user/entities';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await userRepository.delete({ email: 'test@example.com' });
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user and return user + token, and store in DB', async () => {
      const dto: RegisterRequestDto = {
        email: 'test@example.com',
        password: 'test-password',
        firstName: 'e2e',
        lastName: 'user',
      };

      const { status, body } = await request(app.getHttpServer()).post('/auth/register').send(dto);

      expect(status).toBe(201);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('accessToken');
      expect(body.data.user.email).toBe(dto.email);

      const savedUser = await userRepository.findOneBy({ email: dto.email });
      expect(savedUser).toBeDefined();
      expect(savedUser?.email).toBe(dto.email);
      expect(savedUser?.firstName).toBe(dto.firstName);
      expect(savedUser?.lastName).toBe(dto.lastName);
      expect(savedUser?.password).not.toBe(dto.password);
    });

    it('should return 400 if email is already taken', async () => {
      const dto: RegisterRequestDto = {
        email: 'test@example.com',
        password: 'test-password',
        firstName: 'another',
        lastName: 'user',
      };

      const { status, body } = await request(app.getHttpServer()).post('/auth/register').send(dto);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('User with this email already exists');
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login an existing user and return user + token', async () => {
      const dto: LoginRequestDto = {
        email: 'test@example.com',
        password: 'test-password',
      };

      const { status, body } = await request(app.getHttpServer()).post('/auth/login').send(dto);

      expect(status).toBe(200);

      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('accessToken');
      expect(body.data.user.email).toBe(dto.email);
    });

    it('should return 401 if user does not exist', async () => {
      const dto: LoginRequestDto = {
        email: 'nonExistingUser@example.com',
        password: 'test-password',
      };
      const { status, body } = await request(app.getHttpServer()).post('/auth/login').send(dto);
      expect(status).toBe(401);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid email or password');
    });

    it('should return 401 if password is incorrect', async () => {
      const dto: LoginRequestDto = {
        email: 'test@example.com',
        password: 'incorrect-password',
      };

      const { status, body } = await request(app.getHttpServer()).post('/auth/login').send(dto);

      expect(status).toBe(401);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid email or password');
    });
  });
});
