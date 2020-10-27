import { ValidUser } from '../Domain/ValidUser';

export class UserDTO implements ValidUser {
  readonly id: string;
  readonly displayName: string;
  readonly username: string;
  readonly image: string;
  readonly email?: string;

  constructor(user: ValidUser) {
    this.id = user.id;
    this.displayName = user.displayName;
    this.username = user.username;
    this.image = user.image;
    this.email = user.email;
  }
}
