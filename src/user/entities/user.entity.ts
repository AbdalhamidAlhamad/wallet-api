import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '~/account/entities';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, name: 'email', unique: true })
  @Index()
  email!: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password!: string;

  @OneToOne(() => Account, (account) => account.user, { cascade: true })
  account!: Account;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
