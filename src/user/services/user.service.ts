import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Account } from '~/account/entities';
import { RegisterRequestDto } from '~/auth/dtos/request';
import { User } from '../entities';
import { UserRepository } from '../repositories';
const SALT_ROUNDS = 10;
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * The transactional decorator wraps the createUser method in a transaction so that if an error occurs during create account,
   * the transaction will be rolled back and the user won't be created.
   */
  async createUser(registerRequestDto: RegisterRequestDto) {
    return this.userRepository.getManager().transaction(async (transactionEntityManager) => {
      const hashedPassword = await bcrypt.hash(registerRequestDto.password, SALT_ROUNDS);
      const user = await transactionEntityManager.save(User, { ...registerRequestDto, password: hashedPassword });
      await transactionEntityManager.save(Account, { userId: user.id });
      return user;
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return this.userRepository.findUserById(id);
  }
}
