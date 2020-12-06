require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

const port: number = Number.parseInt(process.env.MYSQL_PORT);
//const testPort: number = Number.parseInt(process.env.MYSQL_PORT_TEST);

const DatabaseConnectionConfiguration: ConnectionOptions = {
  name: process.env.MYSQL_HOST,
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB,
  //synchronize: true,
  logging: true,
  logger: 'file',
  entities: ['./**/*.entity.ts'],
  migrations: ['./typeorm/migration/**/*.ts'],
  subscribers: ['./**/*.subscriber.ts'],
  cli: {
    entitiesDir: './typeorm/entity',
    migrationsDir: './typeorm/migration',
    subscribersDir: './typeorm/subscriber',
  },
};

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  name: process.env.MYSQL_TEST_NAME,
  type: 'mysql',
  host: process.env.MYSQL_HOST_TEST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB_TEST,
  synchronize: true,
  dropSchema: true,
  logging: true,
  logger: 'file',
  entities: ['./**/*.entity.ts'],
  migrations: ['./typeorm/migration/**/*.ts'],
  subscribers: ['./**/*.subscriber.ts'],
  cli: {
    entitiesDir: './typeorm/entity',
    migrationsDir: './typeorm/migration',
    subscribersDir: './typeorm/subscriber',
  },
};

export { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration };
//module.exports = { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration };
