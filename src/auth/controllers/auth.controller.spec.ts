import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseFactory } from '~/core/utils';
import { LOGIN_REQUEST_MOCK, REGISTER_REQUEST_MOCK, TOKEN_MOCK, USER_MOCK } from '../__testing__/mocks';
import { AuthController } from '../controllers/auth.controller';
import { LoginResponseDto } from '../dtos/response';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMocked<AuthService>;

  beforeEach(async () => {
    authService = createMock<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should return user and tokens on successful registration', async () => {
      authService.register.mockResolvedValue([USER_MOCK, TOKEN_MOCK]);

      const result = await authController.register(REGISTER_REQUEST_MOCK);

      expect(authService.register).toHaveBeenCalledWith(REGISTER_REQUEST_MOCK);
      expect(result).toEqual(ResponseFactory.data(new LoginResponseDto(USER_MOCK, TOKEN_MOCK)));
    });
  });

  describe('login', () => {
    it('should return user and tokens on successful login', async () => {
      authService.login.mockResolvedValue([USER_MOCK, TOKEN_MOCK]);

      const result = await authController.login(LOGIN_REQUEST_MOCK);

      expect(authService.login).toHaveBeenCalledWith(LOGIN_REQUEST_MOCK);
      expect(result).toEqual(ResponseFactory.data(new LoginResponseDto(USER_MOCK, TOKEN_MOCK)));
    });
  });
});
