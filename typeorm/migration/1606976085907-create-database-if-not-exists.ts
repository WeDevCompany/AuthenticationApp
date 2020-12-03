require('dotenv').config();
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDatabaseIfNotExists1606976085907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_HOST ||
        'authentication'} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP DATABASE IF EXISTS ${process.env.MYSQL_HOST || 'authentication'};`,
    );
  }
}
