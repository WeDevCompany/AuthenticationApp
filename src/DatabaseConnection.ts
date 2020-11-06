import { createConnection } from 'typeorm';
import { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration } from '../ormconfig';
const DatabaseConnection = createConnection(DatabaseConnectionConfiguration);
const DatabaseConnectionTest = createConnection(DatabaseConnectionTestConfiguration);
export { DatabaseConnection, DatabaseConnectionTest };
