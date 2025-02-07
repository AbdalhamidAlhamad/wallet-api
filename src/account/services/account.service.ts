import { BadRequestException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { ERRORS } from '~/common/constants';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { ChargeRequestDto, TopUpRequestDto } from '../dtos/request';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(userId: string) {
    this.logger.log(`Creating account for user ${userId}`);
    return this.accountRepository.createAccount(userId);
  }

  async getAccount(userId: string) {
    this.logger.log(`Getting account for user ${userId}`);
    const account = await this.accountRepository.getAccount(userId);

    if (!account) {
      this.logger.error(`Account not found for user ${userId}`);
      throw new UnprocessableEntityException(ERRORS.ACCOUNT_NOT_FOUND);
    }

    return account;
  }

  async topUp(userId: string, { amount }: TopUpRequestDto) {
    this.logger.log(`Topping up account for user ${userId}`);
    return this.accountRepository.getManager().transaction(async (transactionalEntityManager) => {
      // due to sqlite not supporting locking, we can't use passemstice locking

      this.logger.debug(`Getting account for user ${userId}`);
      const account = await transactionalEntityManager.findOne(Account, {
        where: { userId },
      });

      if (!account) {
        this.logger.error(`Account not found for user ${userId}`);
        throw new UnprocessableEntityException(ERRORS.ACCOUNT_NOT_FOUND);
      }

      account.balance = new Decimal(account.balance).plus(amount).toNumber();
      this.logger.debug(`Updating account balance for user ${userId}`);

      await Promise.all([
        transactionalEntityManager.save(Account, account),
        transactionalEntityManager.save(Transaction, {
          accountId: account.id,
          amount,
          type: TransactionType.TOP_UP,
        }),
      ]);
      this.logger.log(`Account balance updated for user ${userId}`);

      return account;
    });
  }

  async charge(userId: string, { amount }: ChargeRequestDto) {
    this.logger.log(`Charging account for user ${userId}`);
    return this.accountRepository.getManager().transaction(async (transactionalEntityManager) => {
      // due to sqlite not supporting locking, we can't use passemstice locking

      this.logger.debug(`Getting account for user ${userId}`);
      const account = await transactionalEntityManager.findOne(Account, {
        where: { userId },
      });

      if (!account) {
        this.logger.error(`Account not found for user ${userId}`);
        throw new UnprocessableEntityException(ERRORS.ACCOUNT_NOT_FOUND);
      }

      if (account.balance < amount) {
        this.logger.error(`Insufficient balance for user ${userId}`);
        throw new BadRequestException(ERRORS.INSUFFICIENT_BALANCE);
      }

      this.logger.debug(`Updating account balance for user ${userId}`);
      account.balance = new Decimal(account.balance).minus(amount).toNumber();

      await Promise.all([
        transactionalEntityManager.save(Account, account),
        transactionalEntityManager.save(Transaction, {
          accountId: account.id,
          amount,
          type: TransactionType.CHARGE,
        }),
      ]);

      this.logger.log(`Account balance updated for user ${userId}`);
      return account;
    });
  }
}
