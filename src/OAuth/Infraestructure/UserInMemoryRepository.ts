import { injectable } from 'inversify';
import { UserRepository } from '../Domain/UserRepository';
import { User } from '../Domain/User';

@injectable()
export class UserInMemoryRepository implements UserRepository {
  private userStorage: User[] = [];

  createUser(user: User) {
    this.userStorage.push(user);
  }

  public deleteUser(id: string): string {
    let updatedUser: User[] = [];
    this.userStorage.map(user => {
      if (user.id !== id) {
        updatedUser.push(user);
      }
    });

    this.userStorage = updatedUser;
    return id;
  }
}
