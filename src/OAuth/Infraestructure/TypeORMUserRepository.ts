import { User } from './../Domain/User';
import { Connection, getConnectionManager } from 'typeorm';
import { DatabaseConnectionConfiguration } from '../../../ormconfig';
import { UserRepository } from '../Domain/UserRepository';
import { UserORM } from './UserORM.entity';
import { injectable } from 'inversify';

@injectable()
class TypeORMUserRepository implements UserRepository {
  private databaseConnection: Connection;
  readonly defaultDatabaseConnectionName = 'default';

  constructor() {
    this.databaseConnection = getConnectionManager().get(
      DatabaseConnectionConfiguration.name || this.defaultDatabaseConnectionName,
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
        provider: user.provider,
      }),
    );
  }

  async deleteUser(id: string) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.findOne({ where: { id: id } });
    user.deleteAt = Date.now().toString();
    await ORMRepo.save(user);
  }

  async findUserByID(id: string) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.findOne({ where: { id: id, deleteAt: undefined } });
    return user;
  }
}

export { TypeORMUserRepository };
