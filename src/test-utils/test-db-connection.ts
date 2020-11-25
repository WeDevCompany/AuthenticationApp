import { createConnection } from 'typeorm';
import { DatabaseConnectionTestConfiguration } from '../../ormconfig';

export async function createDatabaseConnection() {
  return await createConnection(DatabaseConnectionTestConfiguration);
}
