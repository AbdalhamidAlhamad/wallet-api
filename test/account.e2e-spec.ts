import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { Account } from '~/account/entities';
import { AppModule } from '~/app.module';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { IAuthenticatedUser } from '~/common/interfaces';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { User } from '~/user/entities';
const MOCK_TOKEN = 'mock-token';
describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let accountRepository: Repository<Account>;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;

  const mockUser: IAuthenticatedUser = { sub: 'e7dbfdfb-fab2-4473-b064-1ed65297560e', email: 'account@example.com' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    accountRepository = moduleFixture.get<Repository<Account>>(getRepositoryToken(Account));
    transactionRepository = moduleFixture.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.save({
      id: mockUser.sub,
      email: mockUser.email,
      firstName: 'e2e',
      lastName: 'account',
      password: 'test-password',
      account: Account.create({ balance: 1000 }),
    });
  });

  afterAll(async () => {
    await userRepository.delete({ email: mockUser.email });
    await app.close();
  });

  describe('/account (GET)', () => {
    it('should return the user account', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/account')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('balance', 1000);
    });
  });

  describe('/account/top-up (POST)', () => {
    it('should increase the account balance', async () => {
      const dto = { amount: 500 };

      const { status, body } = await request(app.getHttpServer())
        .post('/account/top-up')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send(dto);

      expect(status).toBe(201);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('balance', 1500);

      // Verify in DB
      const updatedAccount = await accountRepository.findOneBy({ userId: mockUser.sub });
      expect(updatedAccount?.balance).toBe(1500);

      const savedTransaction = await transactionRepository.findOneBy({
        accountId: updatedAccount?.id,
        type: TransactionType.TOP_UP,
      });
      expect(savedTransaction).toBeDefined();
      expect(savedTransaction?.amount).toBe(500);
    });
  });

  describe('/account/charge (POST)', () => {
    it('should decrease the account balance', async () => {
      const dto = { amount: 200 };

      const { status, body } = await request(app.getHttpServer())
        .post('/account/charge')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send(dto);

      expect(status).toBe(201);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('balance', 1300); // 1500 - 200 = 1300

      // Verify in DB
      const updatedAccount = await accountRepository.findOneBy({ userId: mockUser.sub });
      expect(updatedAccount?.balance).toBe(1300);

      const savedTransaction = await transactionRepository.findOneBy({
        accountId: updatedAccount?.id,
        type: TransactionType.CHARGE,
      });
      expect(savedTransaction).toBeDefined();
      expect(savedTransaction?.amount).toBe(200);
    });

    it('should return error if insufficient balance', async () => {
      const dto = { amount: 2000 }; // More than balance

      const { status, body } = await request(app.getHttpServer())
        .post('/account/charge')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .send(dto);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message', 'Insufficient balance');
    });
  });
});
