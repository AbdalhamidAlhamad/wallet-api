import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteForTesting1738952517876 implements MigrationInterface {
    name = 'AddCascadeDeleteForTesting1738952517876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_accounts" ("id" varchar PRIMARY KEY NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_accounts"("id", "balance", "user_id", "created_at", "updated_at") SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "accounts"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`ALTER TABLE "temporary_accounts" RENAME TO "accounts"`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
        await queryRunner.query(`CREATE TABLE "temporary_accounts" ("id" varchar PRIMARY KEY NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_accounts"("id", "balance", "user_id", "created_at", "updated_at") SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "accounts"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`ALTER TABLE "temporary_accounts" RENAME TO "accounts"`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`ALTER TABLE "accounts" RENAME TO "temporary_accounts"`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"))`);
        await queryRunner.query(`INSERT INTO "accounts"("id", "balance", "user_id", "created_at", "updated_at") SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "temporary_accounts"`);
        await queryRunner.query(`DROP TABLE "temporary_accounts"`);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "amount" decimal(10,2) NOT NULL, "type" varchar(255) NOT NULL, "account_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "amount", "type", "account_id", "created_at") SELECT "id", "amount", "type", "account_id", "created_at" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`ALTER TABLE "accounts" RENAME TO "temporary_accounts"`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "accounts"("id", "balance", "user_id", "created_at", "updated_at") SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "temporary_accounts"`);
        await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    }

}
