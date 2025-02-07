import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_MOCK } from '~/auth/__testing__/mocks';
import { TARNASCTIONS_MOCK, TRANSACTION_DETAIL_MOCK } from '../__testing__/mocks';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { Transaction } from '../entities';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionService } from '../services/transaction.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: DeepMocked<TransactionRepository>;

  beforeEach(async () => {
    transactionRepository = createMock<TransactionRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService, { provide: TransactionRepository, useValue: transactionRepository }],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('getTransactions', () => {
    it('should return a list of transactions', async () => {
      const filters: TransactionFiltersRequestDto = { page: 1, size: 10 };
      transactionRepository.getTransactions.mockResolvedValue([TARNASCTIONS_MOCK, TARNASCTIONS_MOCK.length]);

      const result = await transactionService.getTransactions(USER_MOCK.id, filters);

      expect(transactionRepository.getTransactions).toHaveBeenCalledWith(USER_MOCK.id, filters);
      expect(result).toEqual([TARNASCTIONS_MOCK, TARNASCTIONS_MOCK.length]);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction if found', async () => {
      transactionRepository.getTransactionById.mockResolvedValue(TRANSACTION_DETAIL_MOCK);

      const result = await transactionService.getTransactionById(USER_MOCK.id, TRANSACTION_DETAIL_MOCK.id);

      expect(transactionRepository.getTransactionById).toHaveBeenCalledWith(TRANSACTION_DETAIL_MOCK.id);
      expect(result).toEqual(TRANSACTION_DETAIL_MOCK);
    });

    it('should throw BadRequestException if transaction is not found', async () => {
      transactionRepository.getTransactionById.mockResolvedValue(null);

      await expect(transactionService.getTransactionById(USER_MOCK.id, 'non-existing-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if transaction does not belong to the user', async () => {
      const transactionNotBelongingToUser = {
        ...TRANSACTION_DETAIL_MOCK,
        account: { userId: 'another-user-id' },
      } as Transaction;

      transactionRepository.getTransactionById.mockResolvedValue(transactionNotBelongingToUser);

      await expect(transactionService.getTransactionById(USER_MOCK.id, TRANSACTION_DETAIL_MOCK.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
