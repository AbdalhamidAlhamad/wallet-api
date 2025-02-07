import { ApiProperty } from '@nestjs/swagger';
import { Account } from '~/account/entities';

export class AccountResponeDto {
  @ApiProperty({ example: '55168a69-2902-4da3-809e-70cf3c93adb6' })
  id!: string;

  @ApiProperty({ example: 0 })
  balance!: number;

  constructor(account: Account) {
    this.id = account.id;
    this.balance = account.balance;
  }
}
