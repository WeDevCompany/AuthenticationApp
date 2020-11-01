import { Connection, createConnection } from 'typeorm';
import { connection } from '../../../ormconfig';
import { UserRepository } from '../Domain/UserRepository';

class TypeORMUserRepository implements UserRepository {
  createuser(User: any) {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: string) {
    throw new Error('Method not implemented.');
  }
  private databaseConnection: Promise<Connection>;

  constructor() {
    this.databaseConnection = createConnection(JSON.stringify(connection));
    this.databaseConnection.then(connection => console.log('dwedd', connection));
  }
}

export { TypeORMUserRepository };
