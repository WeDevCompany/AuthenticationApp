import { injectable } from 'inversify';
import { OldUserRepository } from '../Domain/OldUserRepository';
import { OldUser } from '../Domain/OldUser';

@injectable()
export class OldUserInMemoryRepository implements OldUserRepository {
  private userStorage: OldUser[] = [
    {
      email: 'lorem@ipsum.com',
      name: 'Lorem',
    },
    {
      email: 'doloe@sit.com',
      name: 'Dolor',
    },
  ];

  public getUsers(): OldUser[] {
    return this.userStorage;
  }

  public getUser(id: string): OldUser {
    let result: OldUser;
    this.userStorage.map(user => {
      if (user.name === id) {
        result = user;
      }
    });

    return result;
  }

  public newUser(user: OldUser): OldUser {
    this.userStorage.push(user);
    return user;
  }

  public updateUser(id: string, user: OldUser): OldUser {
    this.userStorage.map((entry, index) => {
      if (entry.name === id) {
        this.userStorage[index] = user;
      }
    });

    return user;
  }

  public deleteUser(id: string): string {
    let updatedUser: OldUser[] = [];
    this.userStorage.map(user => {
      if (user.name !== id) {
        updatedUser.push(user);
      }
    });

    this.userStorage = updatedUser;
    return id;
  }
}
