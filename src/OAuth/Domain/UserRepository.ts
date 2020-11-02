import { User } from './User';

export interface UserRepository {
  createUser(user: User): any;
  deleteUser(id: string): any;
}
