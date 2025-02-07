import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountEntity1738873597593 implements MigrationInterface {
  name = 'CreateAccountEntity1738873597593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accounts" 
      ("id" varchar PRIMARY KEY NOT NULL, 
      "balance" decimal(10,2) NOT NULL DEFAULT (0), 
      "user_id" varchar NOT NULL, 
      "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_accounts" 
      ("id" varchar PRIMARY KEY NOT NULL, 
      "balance" decimal(10,2) NOT NULL DEFAULT (0), 
      "user_id" varchar NOT NULL, 
      "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), 
      CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") 
      REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_accounts"
      ("id", "balance", "user_id", "created_at", "updated_at") 
      SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "accounts"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`ALTER TABLE "temporary_accounts" RENAME TO "accounts"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accounts" RENAME TO "temporary_accounts"`);
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" varchar PRIMARY KEY NOT NULL, "balance" decimal(10,2) NOT NULL DEFAULT (0), "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "accounts"("id", "balance", "user_id", "created_at", "updated_at") SELECT "id", "balance", "user_id", "created_at", "updated_at" FROM "temporary_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
  }
}
