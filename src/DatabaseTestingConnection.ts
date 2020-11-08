import { createConnection, getConnection } from 'typeorm';
import { DatabaseConnectionTestConfiguration } from '../ormconfig';

const DatabaseTestingConnection = {
  async create() {
    await createConnection(DatabaseConnectionTestConfiguration.name);
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};
export default DatabaseTestingConnection;
