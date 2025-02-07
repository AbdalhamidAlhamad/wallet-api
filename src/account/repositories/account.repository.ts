import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities';

@Injectable()
export class AccountRepository {
  constructor(@InjectRepository(Account) private accountRepository: Repository<Account>) {}

  createAccount(userId: string) {
    return this.accountRepository.save(
      this.accountRepository.create({
        userId,
      }),
    );
  }

  getAccount(userId: string) {
    return this.accountRepository.findOne({ where: { userId } });
  }

  topUp(userId: string, amount: number) {
    return this.accountRepository.update({ userId }, { balance: () => `balance + ${amount}` });
  }

  charge(userId: string, amount: number) {
    return this.accountRepository.update({ userId }, { balance: () => `balance - ${amount}` });
  }

  getManager() {
    return this.accountRepository.manager;
  }
}
