import { User } from './User';

export interface UserRepository {
  getUsers(): User[];
  getUser(id: string): User;
  newUser(user: User): User;
  updateUser(id: string, user: User): User;
  deleteUser(id: string): string;
}
