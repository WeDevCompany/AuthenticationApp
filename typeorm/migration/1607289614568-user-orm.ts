import { MigrationInterface, QueryRunner } from 'typeorm';

export class userOrm1607289614568 implements MigrationInterface {
  name = 'userOrm1607289614568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user_orm` (`id` varchar(36) NOT NULL, `displayName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `image` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `provider` varchar(255) NOT NULL, `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user_orm`');
  }
}
