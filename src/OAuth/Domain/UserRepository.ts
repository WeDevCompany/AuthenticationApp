import { IUser } from './IUser';

export interface UserRepository {
  getUsers(): IUser[];
  getUser(id: string): IUser;
  newUser(user: IUser): IUser;
  updateUser(id: string, user: IUser): IUser;
  deleteUser(id: string): string;
}
