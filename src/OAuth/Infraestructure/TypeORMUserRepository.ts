import { User } from './../Domain/User';
import { Connection, getConnectionManager, IsNull, ConnectionOptions } from 'typeorm';
import { UserRepository } from '../Domain/UserRepository';
import { UserORM } from './UserORM.entity';
import { injectable } from 'inversify';
import { inject } from 'inversify';
import TYPES from '../../constant/types';

@injectable()
class TypeORMUserRepository implements UserRepository {
  private databaseConnection: Connection;
  readonly defaultDatabaseConnectionName = 'default';

  constructor(@inject(TYPES.ConnectionOptions) databaseConnection: ConnectionOptions) {
    console.log(getConnectionManager());
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
    user.deleteAt = Date.now().toString();
    await ORMRepo.save(user);
  }

  async findUserByID(id: string): Promise<User> {
    const ORMRepo = await this.databaseConnection.getRepository(UserORM);
    const user = await ORMRepo.findOne({ where: { id: id, deleteAt: IsNull() } });
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
      displayName: user.displayName,
      username: user.username,
      image: user.image,
      email: user.email,
      provider: user.provider,
    };
  }
}

export { TypeORMUserRepository };
