require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

const port: number = Number.parseInt(process.env.MYSQL_PORT);

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  name: process.env.MYSQL_TEST_NAME,
  type: 'mysql',
  host: 'localhost',
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB_TEST,
  synchronize: true,
  dropSchema: true,
  logging: true,
  logger: 'file',
  entities: ['./**/*.entity.ts'],
  migrations: ['./**/*.migration.ts'],
  subscribers: ['./**/*.subscriber.ts'],
  cli: {
    entitiesDir: './typeorm/entity',
    migrationsDir: './typeorm/migration',
    subscribersDir: './typeorm/subscriber',
  },
};

export = DatabaseConnectionTestConfiguration;
