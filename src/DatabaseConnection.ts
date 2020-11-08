const typeorm = require('typeorm');
import { DatabaseConnectionConfiguration, DatabaseConnectionTestConfiguration } from '../ormconfig';
const DatabaseConnection = typeorm.createConnection(DatabaseConnectionConfiguration);
const DatabaseConnectionTest = typeorm.createConnection(DatabaseConnectionTestConfiguration);
export { DatabaseConnection, DatabaseConnectionTest };
