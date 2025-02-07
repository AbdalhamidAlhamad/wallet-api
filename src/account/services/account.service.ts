import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { ChargeRequestDto, TopUpRequestDto } from '../dtos/request';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(userId: string) {
    return this.accountRepository.createAccount(userId);
  }

  async getAccount(userId: string) {
    const account = await this.accountRepository.getAccount(userId);

    if (!account) {
      throw new UnprocessableEntityException('Account not found');
    }

    return account;
  }

  async topUp(userId: string, { amount }: TopUpRequestDto) {
    return this.accountRepository.getManager().transaction(async (transactionalEntityManager) => {
      // due to sqlite not supporting locking, we can't use passemstice locking
      const account = await transactionalEntityManager.findOne(Account, {
        where: { userId },
      });

      if (!account) {
        throw new UnprocessableEntityException('Account not found');
      }

      account.balance = new Decimal(account.balance).plus(amount).toNumber();

      await Promise.all([
        await transactionalEntityManager.save(Account, account),
        await transactionalEntityManager.save(Transaction, {
          accountId: account.id,
          amount,
          type: TransactionType.TOP_UP,
        }),
      ]);

      return account;
    });
  }

  async charge(userId: string, { amount }: ChargeRequestDto) {
    return this.accountRepository.getManager().transaction(async (transactionalEntityManager) => {
      // due to sqlite not supporting locking, we can't use passemstice locking
      const account = await transactionalEntityManager.findOne(Account, {
        where: { userId },
      });

      if (!account) {
        throw new UnprocessableEntityException('Account not found');
      }

      if (account.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      account.balance = new Decimal(account.balance).minus(amount).toNumber();

      await Promise.all([
        await transactionalEntityManager.save(Account, account),
        await transactionalEntityManager.save(Transaction, {
          accountId: account.id,
          amount,
          type: TransactionType.CHARGE,
        }),
      ]);

      return account;
    });
  }
}
