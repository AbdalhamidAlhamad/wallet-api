import { ApiProperty } from '@nestjs/swagger';
import { AccountResponeDto } from '~/account/dtos/response';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { UserResponseDto } from '~/user/dtos/response';

export class TransactionDetailsResponseDto {
  @ApiProperty({ example: '24f8dac1-7a3e-49c8-8696-e0f960232729' })
  id!: string;

  @ApiProperty({ example: TransactionType.CHARGE })
  type!: TransactionType;

  @ApiProperty({ example: 100 })
  amount!: number;

  @ApiProperty({ type: AccountResponeDto })
  account!: AccountResponeDto;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ example: '2021-09-20T00:00:00.000Z' })
  createdAt!: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.createdAt = transaction.createdAt;
    this.account = new AccountResponeDto(transaction.account);
    this.user = new UserResponseDto(transaction.account.user);
  }
}
