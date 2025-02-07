import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '~/common/decorators';
import { IAuthenticatedUser } from '~/common/interfaces';
import { CustomParseUUIDPipe } from '~/core/pipes';
import { ResponseFactory } from '~/core/utils';
import { TransactionFiltersRequestDto } from '../dtos/request';
import { TransactionDetailsResponseDto, TransactionListResponseDto } from '../dtos/response';
import { TransactionService } from '../services';

@Controller('transactions')
@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransactions(@AuthenticatedUser() user: IAuthenticatedUser, @Query() filters: TransactionFiltersRequestDto) {
    const [transactions, count] = await this.transactionService.getTransactions(user.sub, filters);

    return ResponseFactory.dataPage(
      transactions.map((transaction) => new TransactionListResponseDto(transaction)),
      {
        page: filters.page,
        size: filters.size,
        itemCount: count,
      },
    );
  }

  @Get(':transactionId')
  async getTransaction(
    @AuthenticatedUser() user: IAuthenticatedUser,
    @Param('transactionId', CustomParseUUIDPipe) transactionId: string,
  ) {
    const transaction = await this.transactionService.getTransactionById(user.sub, transactionId);

    return ResponseFactory.data(new TransactionDetailsResponseDto(transaction));
  }
}
