import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from '~/auth/dtos/request';
import { UserRepository } from '../repositories';
const SALT_ROUNDS = 10;
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(registerRequestDto: RegisterRequestDto) {
    const hashedPassword = await bcrypt.hash(registerRequestDto.password, SALT_ROUNDS);
    return this.userRepository.createUser(registerRequestDto, hashedPassword);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return this.userRepository.findUserById(id);
  }
}
