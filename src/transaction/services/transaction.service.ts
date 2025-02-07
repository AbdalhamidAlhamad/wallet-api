import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ERRORS } from '~/common/constants';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { TransactionRepository } from '../repositories';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(private readonly transactionRepository: TransactionRepository) {}

  getTransactions(userId: string, filters: TransactionFiltersRequestDto) {
    this.logger.log(`Getting transactions for user ${userId} with filters ${JSON.stringify(filters)}`);
    return this.transactionRepository.getTransactions(userId, filters);
  }

  async getTransactionById(userId: string, transactionId: string) {
    this.logger.log(`Getting transaction with id ${transactionId} for user ${userId}`);
    const transaction = await this.transactionRepository.getTransactionById(transactionId);

    if (!transaction) {
      this.logger.error(`Transaction with id ${transactionId} not found`);
      throw new BadRequestException(ERRORS.TRANSACTION_NOT_FOUND);
    }

    if (transaction.account.userId !== userId) {
      this.logger.error(`User ${userId} does not have permission to access transaction with id ${transactionId}`);
      throw new BadRequestException(ERRORS.TRANSACTION_ACCESS_ERROR);
    }

    this.logger.log(`Transaction with id ${transactionId} found for user ${userId}`);

    return transaction;
  }
}
