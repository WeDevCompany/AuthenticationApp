import { User } from './../Domain/User';
import {
  Connection,
  getConnectionManager,
  IsNull,
  ConnectionOptions,
  /*getConnection,*/
} from 'typeorm';
import { UserRepository } from '../Domain/UserRepository';
import { UserORM } from './UserORM.entity';
import { injectable } from 'inversify';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { DateTime } from '../Domain/DateTime';

@injectable()
class TypeORMUserRepository implements UserRepository {
  private databaseConnection: Connection;
  readonly defaultDatabaseConnectionName = 'default';

  constructor(@inject(TYPES.ConnectionOptions) databaseConnection: ConnectionOptions) {
    this.databaseConnection = getConnectionManager().get(
      databaseConnection.name || this.defaultDatabaseConnectionName,
    );
  }

  async createUser(user: User) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    await ORMRepo.save(ORMRepo.create(this.domainUserToOrmUserData(user)));
  }

  async deleteUser(id: string) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.findOne({ where: { id: id } });
    user.deleteAt = DateTime.now();
    await ORMRepo.save(user);
  }

  async findUserByID(id: string): Promise<User | null> {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.findOne({ where: { id: id, deleteAt: IsNull() } });
    if (!user) {
      return null;
    }
    return this.ormUserToDomainUser(user);
  }

  async findUserByEmail(email: string) {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.find({ where: { email: email, deleteAt: IsNull() } });
    return user;
  }

  ormUserToDomainUser(user: UserORM): User {
    return new User(user);
  }

  domainUserToOrmUserData(user: User): object {
    return {
      id: user.id,
      idFromProvider: user.idFromProvider,
      displayName: user.displayName,
      username: user.username,
      image: user.image,
      email: user.email,
      provider: user.provider,
    };
  }
}

export { TypeORMUserRepository };
