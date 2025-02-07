import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_MOCK } from '~/auth/__testing__/mocks';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { ResponseFactory } from '~/core/utils';
import { ACCOUNT_MOCK } from '../__testing__';
import { AccountController } from '../controllers/account.controller';
import { ChargeRequestDto, TopUpRequestDto } from '../dtos/request';
import { AccountResponeDto } from '../dtos/response';
import { Account } from '../entities';
import { AccountService } from '../services/account.service';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: DeepMocked<AccountService>;

  beforeEach(async () => {
    accountService = createMock<AccountService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: accountService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true),
      })
      .compile();

    accountController = module.get<AccountController>(AccountController);
  });

  describe('getAccount', () => {
    it('should return the user account', async () => {
      accountService.getAccount.mockResolvedValue(ACCOUNT_MOCK);

      const result = await accountController.getAccount({ sub: USER_MOCK.id, email: USER_MOCK.email });

      expect(accountService.getAccount).toHaveBeenCalledWith(USER_MOCK.id);
      expect(result).toEqual(ResponseFactory.data(new AccountResponeDto(ACCOUNT_MOCK)));
    });
  });

  describe('topUp', () => {
    it('should return updated account after top-up', async () => {
      const topUpDto: TopUpRequestDto = { amount: 500 };
      const updatedAccount = { ...ACCOUNT_MOCK, balance: 1500 } as Account;

      accountService.topUp.mockResolvedValue(updatedAccount);

      const result = await accountController.topUp(topUpDto, { sub: USER_MOCK.id, email: USER_MOCK.email });

      expect(accountService.topUp).toHaveBeenCalledWith(USER_MOCK.id, topUpDto);
      expect(result).toEqual(ResponseFactory.data(new AccountResponeDto(updatedAccount)));
    });
  });

  describe('charge', () => {
    it('should return updated account after charge', async () => {
      const chargeDto: ChargeRequestDto = { amount: 200 };
      const updatedAccount = { ...ACCOUNT_MOCK, balance: 800 } as Account;

      accountService.charge.mockResolvedValue(updatedAccount);

      const result = await accountController.charge(chargeDto, { sub: USER_MOCK.id, email: USER_MOCK.email });

      expect(accountService.charge).toHaveBeenCalledWith(USER_MOCK.id, chargeDto);
      expect(result).toEqual(ResponseFactory.data(new AccountResponeDto(updatedAccount)));
    });
  });
});
