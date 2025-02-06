import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestEntity1738855568413 implements MigrationInterface {
  name = 'TestEntity1738855568413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "test" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "test"`);
  }
}
