import { User } from './User';

export interface UserRepository {
  createuser(User): any;
  deleteUser(id: string): any;
}
