import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '~/transaction/entities';
import { User } from '~/user/entities';

@Entity('accounts')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'balance',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  balance!: number;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
