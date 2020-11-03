import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
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
      const repoPromise = this.repo.findUserByEmail(googleUser.email);
      const user = await repoPromise.then(userdata => userdata);
      if (!user) {
        this.logger.log(`Usuario no encontrado`);
        // TODO crear y lanzar excepcion
      }
      this.logger.log(`Usuario encontrado: ${JSON.stringify(user)}`);
      this.logger.log(`Intentando almacenar ${JSON.stringify(googleUser)}`);
      this.repo.createUser(new User(googleUser));
      return { status: 'success' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
