require('dotenv').config();
import { MigrationInterface, QueryRunner } from 'typeorm';

let db = process.env.MYSQL_DB || 'authentication';
if (process.env.NODE_ENV === 'test') {
  db = process.env.MYSQL_DB_TEST;
}

export class createDatabaseIfNotExists1606976085907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE DATABASE IF NOT EXISTS ${db} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP DATABASE IF EXISTS ${db};`);
  }
}
