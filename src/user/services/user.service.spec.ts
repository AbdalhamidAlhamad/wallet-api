import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Account } from '~/account/entities';
import { REGISTER_REQUEST_MOCK, USER_MOCK } from '~/auth/__testing__/mocks';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: DeepMocked<UserRepository>;

  beforeEach(async () => {
    userRepository = createMock<UserRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: userRepository }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user and account', async () => {
      const mockTransactionManager = createMock<any>();
      userRepository.getManager.mockReturnValue(mockTransactionManager);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock bcrypt hashing
      mockTransactionManager.transaction.mockImplementation(async (callback: any) => callback(mockTransactionManager));
      mockTransactionManager.save.mockResolvedValue(USER_MOCK);

      const result = await userService.createUser(REGISTER_REQUEST_MOCK);

      expect(bcrypt.hash).toHaveBeenCalledWith(REGISTER_REQUEST_MOCK.password, 10); // Ensure password hashing
      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        User,
        expect.objectContaining({ email: REGISTER_REQUEST_MOCK.email, password: 'hashedPassword' }),
      );
      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        Account,
        expect.objectContaining({ userId: USER_MOCK.id }),
      );
      expect(result).toEqual(USER_MOCK);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(USER_MOCK);

      const result = await userService.findByEmail(USER_MOCK.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(USER_MOCK.email);
      expect(result).toEqual(USER_MOCK);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      userRepository.findUserById.mockResolvedValue(USER_MOCK);

      const result = await userService.findUserById(USER_MOCK.id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual(USER_MOCK);
    });
  });
});
