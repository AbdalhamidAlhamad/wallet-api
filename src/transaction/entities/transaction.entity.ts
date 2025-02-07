import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '~/account/entities';
import { TransactionType } from '../enums';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type!: TransactionType;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
