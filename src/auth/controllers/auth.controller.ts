import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseFactory } from '~/core/utils';
import { LoginRequestDto, RegisterRequestDto } from '../dtos/request';
import { LoginResponseDto } from '../dtos/response';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    const [user, tokens] = await this.authService.register(registerRequestDto);

    return ResponseFactory.data(new LoginResponseDto(user, tokens));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const [user, tokens] = await this.authService.login(loginRequestDto);

    return ResponseFactory.data(new LoginResponseDto(user, tokens));
  }
}
