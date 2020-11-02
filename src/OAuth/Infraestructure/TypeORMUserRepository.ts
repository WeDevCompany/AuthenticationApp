import { User } from './../Domain/User';
import { Connection, getConnectionManager } from 'typeorm';
import { DatabaseConnectionConfiguration } from '../../../ormconfig';
import { UserRepository } from '../Domain/UserRepository';
import { UserORM } from './UserORM.entity';
import { injectable } from 'inversify';

@injectable()
class TypeORMUserRepository implements UserRepository {
  private databaseConnection: Connection;

  constructor() {
    this.databaseConnection = getConnectionManager().get(
      DatabaseConnectionConfiguration.name || 'default',
    );
  }

  async createUser(user: User) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    await ORMRepo.save(
      ORMRepo.create({
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        image: user.image,
        email: user.email,
      }),
    );
  }

  async deleteUser(id: string) {
    throw new Error('Method not implemented.');
  }
}

export { TypeORMUserRepository };
