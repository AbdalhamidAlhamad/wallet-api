import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from '~/user/services';
import { LOGIN_REQUEST_MOCK, REGISTER_REQUEST_MOCK, TOKEN_MOCK, USER_MOCK } from '../__testing__/mocks';
import { AuthService } from '../services/auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: DeepMocked<UserService>;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(async () => {
    userService = createMock<UserService>();
    jwtService = createMock<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user and return user and tokens', async () => {
      userService.findByEmail.mockResolvedValue(null); // No existing user
      userService.createUser.mockResolvedValue(USER_MOCK);
      jwtService.sign.mockReturnValue(TOKEN_MOCK.accessToken);

      const result = await authService.register(REGISTER_REQUEST_MOCK);

      expect(userService.findByEmail).toHaveBeenCalledWith(REGISTER_REQUEST_MOCK.email);
      expect(userService.createUser).toHaveBeenCalledWith(REGISTER_REQUEST_MOCK);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: USER_MOCK.id });
      expect(result).toEqual([USER_MOCK, TOKEN_MOCK]);
    });

    it('should throw BadRequestException if user already exists', async () => {
      userService.findByEmail.mockResolvedValue(USER_MOCK); // User exists

      await expect(authService.register(REGISTER_REQUEST_MOCK)).rejects.toThrow(
        new BadRequestException('User with this email already exists'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(REGISTER_REQUEST_MOCK.email);
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should validate user and return user and tokens', async () => {
      userService.findByEmail.mockResolvedValue(USER_MOCK);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Valid password
      jwtService.sign.mockReturnValue(TOKEN_MOCK.accessToken);

      const result = await authService.login(LOGIN_REQUEST_MOCK);

      expect(userService.findByEmail).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK.password, USER_MOCK.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: USER_MOCK.id });
      expect(result).toEqual([USER_MOCK, TOKEN_MOCK]);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(LOGIN_REQUEST_MOCK)).rejects.toThrow(
        new UnauthorizedException('Invalid password'),
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK.email);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      userService.findByEmail.mockResolvedValue(USER_MOCK);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Invalid password

      await expect(authService.login(LOGIN_REQUEST_MOCK)).rejects.toThrow(
        new UnauthorizedException('Invalid password'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK.password, USER_MOCK.password);
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      userService.findUserById.mockResolvedValue(USER_MOCK);

      const result = await authService.validateUser(USER_MOCK.id);

      expect(userService.findUserById).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual(USER_MOCK);
    });

    it('should return null if user is not found', async () => {
      userService.findUserById.mockResolvedValue(null);

      const result = await authService.validateUser(USER_MOCK.id);

      expect(userService.findUserById).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toBeNull();
    });
  });
});
