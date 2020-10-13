import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IUser } from '../Domain/IUser';
import { UserRepository } from '../Domain/UserRepository';
import { Request } from 'express';
import TYPES from '../../constant/types';

@controller('/user')
export class UserController {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  @httpGet('/')
  public getUsers(): IUser[] {
    return this.userRepository.getUsers();
  }

  @httpGet('/:id')
  public getUser(request: Request): IUser {
    return this.userRepository.getUser(request.params.id);
  }

  @httpPost('/')
  public newUser(request: Request): IUser {
    return this.userRepository.newUser(request.body);
  }

  @httpPut('/:id')
  public updateUser(request: Request): IUser {
    return this.userRepository.updateUser(request.params.id, request.body);
  }

  @httpDelete('/:id')
  public deleteUser(request: Request): string {
    return this.userRepository.deleteUser(request.params.id);
  }
}
