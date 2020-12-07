require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

const port: number = Number.parseInt(process.env.MYSQL_PORT);

const DatabaseConnectionCLIConfiguration: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  // host: 'localhost',
  host: process.env.MYSQL_HOST,
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB,
  //dropSchema: true,
  logging: true,
  // logger: 'file',
  //migrationsRun: true,
  entities: ['./**/*.entity.ts'],
  migrations: ['./typeorm/migration/**/*.ts'],
  subscribers: ['./**/*.subscriber.ts'],
  cli: {
    entitiesDir: './typeorm/entity',
    migrationsDir: './typeorm/migration',
    subscribersDir: './typeorm/subscriber',
  },
};

export = DatabaseConnectionCLIConfiguration;
