import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '~/user/entities';
import { UserService } from '~/user/services';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/request';
import { IAuthTokens } from '../interfaces';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}
  async register(registerRequestDto: RegisterRequestDto): Promise<[User, IAuthTokens]> {
    const existingUser = await this.userService.findByEmail(registerRequestDto.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const createdUser = await this.userService.createUser(registerRequestDto);

    const authTokens = this.generateToken(createdUser);
    return [createdUser, authTokens];
  }

  async login(loginRequestDto: LoginRequestDto): Promise<[User, IAuthTokens]> {
    const user = await this.userService.findByEmail(loginRequestDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid password');
    }

    const isPasswordValid = await bcrypt.compare(loginRequestDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const authTokens = this.generateToken(user);
    return [user, authTokens];
  }

  async validateUser(id: string) {
    return this.userService.findUserById(id);
  }

  private generateToken(user: User) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
