import { Connection, createConnection } from 'typeorm';
import { UserRepository } from '../Domain/UserRepository';

class TypeORMUserRepository implements UserRepository {
  private databaseConnection: Connection;

  async TypeORMUserRepository() {
    this.databaseConnection = await createConnection();
  }
}
