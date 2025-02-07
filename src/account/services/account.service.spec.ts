import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Decimal from 'decimal.js';
import { USER_MOCK } from '~/auth/__testing__/mocks';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { ACCOUNT_MOCK } from '../__testing__';
import { ChargeRequestDto, TopUpRequestDto } from '../dtos/request';
import { Account } from '../entities/account.entity';
import { AccountRepository } from '../repositories/account.repository';
import { AccountService } from '../services/account.service';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: DeepMocked<AccountRepository>;
  let accountMock = { ...ACCOUNT_MOCK } as Account;
  beforeEach(async () => {
    accountMock = { ...ACCOUNT_MOCK, balance: 1000 } as Account;
    accountRepository = createMock<AccountRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, { provide: AccountRepository, useValue: accountRepository }],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
  });

  describe('createAccount', () => {
    it('should create and return an account', async () => {
      accountRepository.createAccount.mockResolvedValue(accountMock);

      const result = await accountService.createAccount(USER_MOCK.id);

      expect(accountRepository.createAccount).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual(accountMock);
    });
  });

  describe('getAccount', () => {
    it('should return an account if found', async () => {
      accountRepository.getAccount.mockResolvedValue(accountMock);

      const result = await accountService.getAccount(USER_MOCK.id);

      expect(accountRepository.getAccount).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual(accountMock);
    });

    it('should throw UnprocessableEntityException if account is not found', async () => {
      accountRepository.getAccount.mockResolvedValue(null);

      await expect(accountService.getAccount(USER_MOCK.id)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('topUp', () => {
    it('should increase account balance and save transaction', async () => {
      const topUpDto: TopUpRequestDto = { amount: 500 };
      const updatedAccount = {
        ...accountMock,
        balance: new Decimal(accountMock.balance).plus(topUpDto.amount).toNumber(),
      };

      const mockTransactionManager = createMock<any>();
      accountRepository.getManager.mockReturnValue(mockTransactionManager);

      mockTransactionManager.transaction.mockImplementation(async (callback: any) => callback(mockTransactionManager));
      mockTransactionManager.findOne.mockResolvedValue(accountMock);
      mockTransactionManager.save.mockResolvedValue(updatedAccount);

      const result = await accountService.topUp(USER_MOCK.id, topUpDto);

      expect(mockTransactionManager.findOne).toHaveBeenCalledWith(Account, { where: { userId: USER_MOCK.id } });
      expect(mockTransactionManager.save).toHaveBeenCalledWith(Account, updatedAccount);
      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        Transaction,
        expect.objectContaining({
          accountId: accountMock.id,
          amount: topUpDto.amount,
          type: TransactionType.TOP_UP,
        }),
      );
      expect(result.balance).toBe(1500);
    });
  });

  describe('charge', () => {
    it('should decrease account balance and save transaction', async () => {
      const chargeDto: ChargeRequestDto = { amount: 200 };
      const updatedAccount = {
        ...accountMock,
        balance: new Decimal(accountMock.balance).minus(chargeDto.amount).toNumber(),
      };

      const mockTransactionManager = createMock<any>();
      accountRepository.getManager.mockReturnValue(mockTransactionManager);

      mockTransactionManager.transaction.mockImplementation(async (callback: any) => callback(mockTransactionManager));
      mockTransactionManager.findOne.mockResolvedValue(accountMock);
      mockTransactionManager.save.mockResolvedValue(updatedAccount);

      const result = await accountService.charge(USER_MOCK.id, chargeDto);

      expect(mockTransactionManager.findOne).toHaveBeenCalledWith(Account, { where: { userId: USER_MOCK.id } });
      expect(mockTransactionManager.save).toHaveBeenCalledWith(Account, updatedAccount);
      expect(mockTransactionManager.save).toHaveBeenCalledWith(
        Transaction,
        expect.objectContaining({
          accountId: accountMock.id,
          amount: chargeDto.amount,
          type: TransactionType.CHARGE,
        }),
      );
      expect(result.balance).toBe(800);
    });

    it('should throw BadRequestException if insufficient balance', async () => {
      const chargeDto: ChargeRequestDto = { amount: 1500 }; // More than available balance

      const mockTransactionManager = createMock<any>();
      accountRepository.getManager.mockReturnValue(mockTransactionManager);

      mockTransactionManager.transaction.mockImplementation(async (callback: any) => callback(mockTransactionManager));
      mockTransactionManager.findOne.mockResolvedValue(accountMock);

      await expect(accountService.charge(USER_MOCK.id, chargeDto)).rejects.toThrow(BadRequestException);
    });
  });
});
