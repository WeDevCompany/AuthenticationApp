import { OldUser } from './OldUser';

export interface OldUserRepository {
  getUsers(): OldUser[];
  getUser(id: string): OldUser;
  newUser(user: OldUser): OldUser;
  updateUser(id: string, user: OldUser): OldUser;
  deleteUser(id: string): string;
}
