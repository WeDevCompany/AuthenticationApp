require('dotenv').config();
import { ConnectionOptions } from 'typeorm';

const port: number = Number.parseInt(process.env.MYSQL_PORT);

const DatabaseConnectionTestConfiguration: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.LOCALHOST,
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
    entitiesDir: './typeorm/entity',
    migrationsDir: './typeorm/migration',
    subscribersDir: './typeorm/subscriber',
  },
};

module.exports = DatabaseConnectionTestConfiguration;
