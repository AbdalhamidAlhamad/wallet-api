import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Account } from '~/account/entities';
import { RegisterRequestDto } from '~/auth/dtos/request';
import { User } from '../entities';
import { UserRepository } from '../repositories';
const SALT_ROUNDS = 10;
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * The transactional decorator wraps the createUser method in a transaction so that if an error occurs during create account,
   * the transaction will be rolled back and the user won't be created.
   */
  async createUser(registerRequestDto: RegisterRequestDto) {
    this.logger.log(`Creating user with email ${registerRequestDto.email}`);
    return this.userRepository.getManager().transaction(async (transactionEntityManager) => {
      this.logger.debug(`Hashing password for user with email ${registerRequestDto.email}`);
      const hashedPassword = await bcrypt.hash(registerRequestDto.password, SALT_ROUNDS);

      const user = await transactionEntityManager.save(User, { ...registerRequestDto, password: hashedPassword });
      this.logger.debug(`User with email ${registerRequestDto.email} created successfully awaiting account creation`);
      await transactionEntityManager.save(Account, { userId: user.id });
      this.logger.debug(`Account created for user with email ${registerRequestDto.email}`);
      return user;
    });
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding user with email ${email}`);
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    this.logger.log(`Finding user with id ${id}`);
    return this.userRepository.findUserById(id);
  }
}
