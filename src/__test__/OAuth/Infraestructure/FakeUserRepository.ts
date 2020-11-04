import { Logger } from '../../../Logger';
import { User } from '../../../OAuth/Domain/User';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';

class FakeUserRepository implements UserRepository {
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async createUser(user: User) {
    return true;
  }

  async deleteUser(id: string) {
    return true;
  }

  findUserByID(id: string) {
    return true;
  }

  findUserByEmail(email: string) {
    return true;
  }
}

export { FakeUserRepository };
