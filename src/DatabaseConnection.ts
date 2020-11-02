import { createConnection } from 'typeorm';
import { DatabaseConnectionConfiguration } from '../ormconfig';
const DatabaseConnection = createConnection(DatabaseConnectionConfiguration);
export { DatabaseConnection };
