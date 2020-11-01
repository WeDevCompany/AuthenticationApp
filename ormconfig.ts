const connection = {
  type: process.env.ORM_TYPE_OF_DB,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWD,
  database: process.env.MYSQL_DB,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/**/*.entity.ts'],
  migrations: [__dirname + '/**/*.migration.ts'],
  subscribers: [__dirname + '/**/*.subscriber.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

export { connection };
