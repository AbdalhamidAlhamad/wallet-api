import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEntity1738868576303 implements MigrationInterface {
  name = 'CreateUserEntity1738868576303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" 
      ("id" varchar PRIMARY KEY NOT NULL, 
      "first_name" varchar(255) NOT NULL, 
      "last_name" varchar(255) NOT NULL, 
      "email" varchar(255) NOT NULL, 
      "password" varchar(255) NOT NULL, 
      "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), 
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
