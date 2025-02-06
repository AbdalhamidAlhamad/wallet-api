import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from '~/auth/dtos/request';
import { User } from '../entities';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  createUser(registerRequestDto: RegisterRequestDto, hashedPassword: string) {
    return this.userRepository.save(
      this.userRepository.create({
        ...registerRequestDto,
        password: hashedPassword,
      }),
    );
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
