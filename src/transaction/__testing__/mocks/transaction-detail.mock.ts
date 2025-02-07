import { ACCOUNT_MOCK } from '~/account/__testing__';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';

export const TRANSACTION_DETAIL_MOCK = {
  id: 'txn-1',
  amount: 100,
  type: TransactionType.TOP_UP,
  account: ACCOUNT_MOCK,
} as Transaction;
