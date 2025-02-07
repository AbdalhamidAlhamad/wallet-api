import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { Transaction } from '../entities';

@Injectable()
export class TransactionRepository {
  constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) {}

  getTransactions(userId: string, { page, size, type }: TransactionFiltersRequestDto) {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .where('account.userId = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    return queryBuilder
      .skip(size * (page - 1))
      .take(size)
      .getManyAndCount();
  }

  getTransactionById(transactionId: string) {
    return this.transactionRepository.findOne({ where: { id: transactionId }, relations: ['account', 'account.user'] });
  }
}
