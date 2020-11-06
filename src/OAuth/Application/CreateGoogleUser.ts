import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
//import { InvalidUserCreate } from '../Domain/InvalidUserCreate';
import { User } from '../Domain/User';
import { UserRepository } from '../Domain/UserRepository';

export class CreateGoogleUser implements InputService {
  private readonly logger: Logger;
  private readonly repo: UserRepository;

  constructor(
    @inject(TYPES.UserRepository) repo: UserRepository,
    @inject(TYPES.Logger) logger: Logger,
  ) {
    this.repo = repo;
    this.logger = logger;
  }

  //@ts-ignore
  async execute(googleUser: ValidUser): any {
    try {
      //const repoPromise = this.repo.findUserByEmail(googleUser.email);
      //const user = await repoPromise.then(userdata => userdata);
      /*if (user) {
        throw new InvalidUserCreate(`El usuario ${user.email} ya se encuentra registrado`);
      }*/
      this.logger.log(`Intentando almacenar ${JSON.stringify(googleUser)}`);
      await this.repo.createUser(new User(googleUser));
      return { success: 'true' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
