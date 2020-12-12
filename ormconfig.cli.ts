require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

let db = process.env.MYSQL_DB;
let host = process.env.MYSQL_HOST;
if (process.env.NODE_ENV === 'test') {
  db = process.env.MYSQL_DB_TEST;
  host = process.env.MYSQL_HOST_TEST;
}

const port: number = Number.parseInt(process.env.MYSQL_PORT);

const DatabaseConnectionCLIConfiguration: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  // host: 'localhost',
  host: host,
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: db,
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
