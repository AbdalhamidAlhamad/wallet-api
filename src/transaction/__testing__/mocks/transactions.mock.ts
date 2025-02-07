import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';

export const TARNASCTIONS_MOCK = [
  { id: 'txn-1', amount: 100, type: TransactionType.TOP_UP },
  { id: 'txn-2', amount: 200, type: TransactionType.CHARGE },
] as Transaction[];
