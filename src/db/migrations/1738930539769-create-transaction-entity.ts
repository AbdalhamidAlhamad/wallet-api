import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionEntity1738930539769 implements MigrationInterface {
  name = 'CreateTransactionEntity1738930539769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "transactions"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`,
    );
    await queryRunner.query(
      `INSERT INTO "transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "temporary_transactions"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transactions"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
  }
}
