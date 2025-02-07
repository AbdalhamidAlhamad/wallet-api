import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_MOCK } from '~/auth/__testing__/mocks';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { ResponseFactory } from '~/core/utils';
import { TARNASCTIONS_MOCK, TRANSACTION_DETAIL_MOCK } from '../__testing__/mocks';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { TransactionDetailsResponseDto, TransactionListResponseDto } from '../dtos/response';
import { TransactionService } from '../services/transaction.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: DeepMocked<TransactionService>;

  beforeEach(async () => {
    transactionService = createMock<TransactionService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: transactionService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      }) // Bypass JwtAuthGuard
      .compile();

    transactionController = module.get<TransactionController>(TransactionController);
  });

  describe('getTransactions', () => {
    it('should return a paginated list of transactions', async () => {
      const filters: TransactionFiltersRequestDto = { page: 1, size: 10 };
      transactionService.getTransactions.mockResolvedValue([TARNASCTIONS_MOCK, TARNASCTIONS_MOCK.length]);

      const result = await transactionController.getTransactions(
        { sub: USER_MOCK.id, email: USER_MOCK.email },
        filters,
      );

      expect(transactionService.getTransactions).toHaveBeenCalledWith(USER_MOCK.id, filters);
      expect(result).toEqual(
        ResponseFactory.dataPage(
          TARNASCTIONS_MOCK.map((txn) => new TransactionListResponseDto(txn)),
          {
            page: filters.page,
            size: filters.size,
            itemCount: TARNASCTIONS_MOCK.length,
          },
        ),
      );
    });
  });

  describe('getTransaction', () => {
    it('should return details of a transaction', async () => {
      const transactionId = 'txn-1';
      transactionService.getTransactionById.mockResolvedValue(TRANSACTION_DETAIL_MOCK);

      const result = await transactionController.getTransaction(
        { sub: USER_MOCK.id, email: USER_MOCK.email },
        transactionId,
      );

      expect(transactionService.getTransactionById).toHaveBeenCalledWith(USER_MOCK.id, transactionId);
      expect(result).toEqual(ResponseFactory.data(new TransactionDetailsResponseDto(TRANSACTION_DETAIL_MOCK)));
    });
  });
});
