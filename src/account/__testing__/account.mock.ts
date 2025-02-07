import { USER_MOCK } from '~/auth/__testing__/mocks';
import { Account } from '../entities';

export const ACCOUNT_MOCK = {
  id: '1',
  balance: 1000,
  userId: USER_MOCK.id,
  user: USER_MOCK,
} as Account;
