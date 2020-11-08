import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import { DatabaseConnectionTestConfiguration } from '../ormconfig';

const DatabaseTestingConnection = {
  async create() {
    const connection = createConnection(DatabaseConnectionTestConfiguration);
    return connection;
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection(DatabaseConnectionTestConfiguration.name);
    const entities = connection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};

export default DatabaseTestingConnection;
