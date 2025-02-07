import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controllers';
import { Transaction } from './entities';
import { TransactionRepository } from './repositories';
import { TransactionService } from './services';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  imports: [TypeOrmModule.forFeature([Transaction])],
})
export class TransactionModule {}
