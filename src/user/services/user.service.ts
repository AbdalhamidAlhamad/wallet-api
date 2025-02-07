import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Transactional } from 'typeorm-transactional';
import { AccountService } from '~/account/services';
import { RegisterRequestDto } from '~/auth/dtos/request';
import { UserRepository } from '../repositories';
const SALT_ROUNDS = 10;
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly accountService: AccountService) {}

  /**
   * The transactional decorator wraps the createUser method in a transaction so that if an error occurs during create account,
   * the transaction will be rolled back and the user won't be created.
   */
  @Transactional()
  async createUser(registerRequestDto: RegisterRequestDto) {
    const hashedPassword = await bcrypt.hash(registerRequestDto.password, SALT_ROUNDS);

    const user = await this.userRepository.createUser(registerRequestDto, hashedPassword);

    await this.accountService.createAccount(user.id);

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return this.userRepository.findUserById(id);
  }
}
