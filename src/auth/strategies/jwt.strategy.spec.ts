import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_MOCK } from '../__testing__/mocks';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: DeepMocked<AuthService>;
  let configService: DeepMocked<ConfigService>;

  beforeEach(async () => {
    authService = createMock<AuthService>();
    configService = createMock<ConfigService>();

    configService.getOrThrow.mockReturnValue('test-secret'); // Mock JWT_SECRET

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user details when validation succeeds', async () => {
      authService.validateUser.mockResolvedValue(USER_MOCK);

      const result = await jwtStrategy.validate({ sub: USER_MOCK.id, email: USER_MOCK.email });

      expect(authService.validateUser).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual({ sub: USER_MOCK.id, email: USER_MOCK.email });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(jwtStrategy.validate({ sub: USER_MOCK.id, email: USER_MOCK.email })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
