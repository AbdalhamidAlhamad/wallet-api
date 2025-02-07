import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '~/common/decorators';
import { IAuthenticatedUser } from '~/common/interfaces';
import { ResponseFactory } from '~/core/utils';
import { ChargeRequestDto, TopUpRequestDto } from '../dtos/request';
import { AccountResponeDto } from '../dtos/response';
import { AccountService } from '../services';

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccount(@AuthenticatedUser() user: IAuthenticatedUser) {
    const account = await this.accountService.getAccount(user.sub);
    return ResponseFactory.data(new AccountResponeDto(account));
  }

  @Post('top-up')
  async topUp(@Body() body: TopUpRequestDto, @AuthenticatedUser() user: IAuthenticatedUser) {
    const account = await this.accountService.topUp(user.sub, body);
    return ResponseFactory.data(new AccountResponeDto(account));
  }

  @Post('charge')
  async charge(@Body() body: ChargeRequestDto, @AuthenticatedUser() user: IAuthenticatedUser) {
    const account = await this.accountService.charge(user.sub, body);
    return ResponseFactory.data(new AccountResponeDto(account));
  }
}
