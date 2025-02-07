import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERRORS } from '~/common/constants';
import { User } from '~/user/entities';
import { UserService } from '~/user/services';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/request';
import { IAuthTokens } from '../interfaces';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}
  async register(registerRequestDto: RegisterRequestDto): Promise<[User, IAuthTokens]> {
    this.logger.log(`Registering user with email ${registerRequestDto.email}`);
    const existingUser = await this.userService.findByEmail(registerRequestDto.email);

    if (existingUser) {
      this.logger.error(`User with email ${registerRequestDto.email} already exists`);
      throw new BadRequestException(ERRORS.USER_ALREADY_EXISTS);
    }

    const createdUser = await this.userService.createUser(registerRequestDto);

    const authTokens = this.generateToken(createdUser);

    this.logger.log(`User with email ${registerRequestDto.email} registered successfully`);
    return [createdUser, authTokens];
  }

  async login(loginRequestDto: LoginRequestDto): Promise<[User, IAuthTokens]> {
    this.logger.log(`Logging in user with email ${loginRequestDto.email}`);
    const user = await this.userService.findByEmail(loginRequestDto.email);

    if (!user) {
      this.logger.error(`User with email ${loginRequestDto.email} not found`);
      throw new UnauthorizedException(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    this.logger.debug(`Validating password for user with email ${loginRequestDto.email}`);
    const isPasswordValid = await bcrypt.compare(loginRequestDto.password, user.password);

    if (!isPasswordValid) {
      this.logger.error(`Invalid password for user with email ${loginRequestDto.email}`);
      throw new UnauthorizedException(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    const authTokens = this.generateToken(user);
    this.logger.log(`User with email ${loginRequestDto.email} logged in successfully`);
    return [user, authTokens];
  }

  async validateUser(id: string) {
    this.logger.log(`Validating user with id ${id}`);
    return this.userService.findUserById(id);
  }

  private generateToken(user: User) {
    this.logger.debug(`Generating token for user with id ${user.id}`);
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
