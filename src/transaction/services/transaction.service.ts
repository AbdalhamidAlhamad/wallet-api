import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { TransactionRepository } from '../repositories';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  getTransactions(userId: string, filters: TransactionFiltersRequestDto) {
    return this.transactionRepository.getTransactions(userId, filters);
  }

  async getTransactionById(userId: string, transactionId: string) {
    const transaction = await this.transactionRepository.getTransactionById(transactionId);

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new BadRequestException('The user does not have permission to access this transaction');
    }

    return transaction;
  }
}
