require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

const port: number = Number.parseInt(process.env.MYSQL_PORT);

const DatabaseConnectionConfiguration: ConnectionOptions = {
  name: process.env.MYSQL_HOST,
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB,
  synchronize: true,
  logging: true,
  logger: 'file',
  entities: [__dirname + '/**/*.entity.ts'],
  migrations: [__dirname + '/**/*.migration.ts'],
  subscribers: [__dirname + '/**/*.subscriber.ts'],
  cli: {
    entitiesDir: __dirname + './typeorm/entity',
    migrationsDir: __dirname + './typeorm/migration',
    subscribersDir: __dirname + './typeorm/subscriber',
  },
};

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.MYSQL_HOST_TEST,
  port: port,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB_TEST,
  synchronize: true,
  logging: true,
  logger: 'file',
  entities: [__dirname + '/**/*.entity.ts'],
  migrations: [__dirname + '/**/*.migration.ts'],
  subscribers: [__dirname + '/**/*.subscriber.ts'],
  cli: {
    entitiesDir: __dirname + './typeorm/entity',
    migrationsDir: __dirname + './typeorm/migration',
    subscribersDir: __dirname + './typeorm/subscriber',
  },
};

export { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration };
module.exports = { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration };
