import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { In, Repository } from 'typeorm';

import { Account } from '~/account/entities';
import { AppModule } from '~/app.module';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { IAuthenticatedUser } from '~/common/interfaces';
import { Transaction } from '~/transaction/entities';
import { TransactionType } from '~/transaction/enums';
import { User } from '~/user/entities';

const MOCK_TOKEN = 'mock-token';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let transactionRepository: Repository<Transaction>;
  let accountRepository: Repository<Account>;
  let userRepository: Repository<User>;
  const mockUser: IAuthenticatedUser = {
    sub: 'e7dbfdfb-fab2-4473-b064-1ed65297560e',
    email: 'transaction@example.com',
  };
  let transactionId: string;

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

    transactionRepository = moduleFixture.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    accountRepository = moduleFixture.get<Repository<Account>>(getRepositoryToken(Account));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Create a test account
    const testUser = await userRepository.save({
      id: mockUser.sub,
      email: mockUser.email,
      firstName: 'e2e',
      lastName: 'transaction',
      password: 'test-password',
      account: Account.create({ balance: 1000 }),
    });

    // Insert a test transaction
    const testTransaction = await transactionRepository.save([
      {
        accountId: testUser.account.id,
        amount: 500,
        type: TransactionType.TOP_UP,
      },
      {
        accountId: testUser.account.id,
        amount: 200,
        type: TransactionType.CHARGE,
      },
    ]);

    transactionId = testTransaction[0].id;
  });

  afterAll(async () => {
    await userRepository.delete({ email: In([mockUser.email, 'other-email@test.com']) });
    await app.close();
  });

  describe('/transactions (GET)', () => {
    it('should return paginated transactions', async () => {
      const queryParams = { page: 1, size: 10 };

      const { status, body } = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .query(queryParams);

      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(2);
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('size', 10);
      expect(body.meta).toHaveProperty('itemCount');
    });

    it('should return TOP_UP transactions', async () => {
      const queryParams = { page: 1, size: 10, type: TransactionType.TOP_UP };

      const { status, body } = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${MOCK_TOKEN}`)
        .query(queryParams);

      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBe(1);
      expect(body.data[0].type).toBe(TransactionType.TOP_UP);
    });
  });

  it('should return CHARGE transactions', async () => {
    const queryParams = { page: 1, size: 10, type: TransactionType.CHARGE };

    const { status, body } = await request(app.getHttpServer())
      .get('/transactions')
      .set('Authorization', `Bearer ${MOCK_TOKEN}`)
      .query(queryParams);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body.data.length).toBe(1);
    expect(body.data[0].type).toBe(TransactionType.CHARGE);
  });

  describe('/transactions/:transactionId (GET)', () => {
    it('should return a transaction by ID', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id', transactionId);
      expect(body.data).toHaveProperty('amount', 500);
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeTransactionId = '00000000-0000-0000-0000-000000000000';

      const { status, body } = await request(app.getHttpServer())
        .get(`/transactions/${fakeTransactionId}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message', 'Transaction not found');
    });

    it('should return 400 if user does not own transaction', async () => {
      const otherUser = await userRepository.save({
        id: 'e7dbfdfb-fab2-4573-b054-1ed65297560f',
        email: 'other-email@test.com',
        firstName: 'e2e',
        lastName: 'transaction',
        password: 'test-password',
        account: Account.create({ balance: 1000 }),
      });

      const otherTransaction = await transactionRepository.save({
        accountId: otherUser.account.id,
        amount: 200,
        type: TransactionType.CHARGE,
      });

      const { status, body } = await request(app.getHttpServer())
        .get(`/transactions/${otherTransaction.id}`)
        .set('Authorization', `Bearer ${MOCK_TOKEN}`);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message', 'The user does not have permission to access this transaction');
    });
  });
});
