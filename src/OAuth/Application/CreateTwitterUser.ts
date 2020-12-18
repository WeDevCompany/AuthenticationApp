import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
//import { InvalidUserCreate } from '../Domain/InvalidUserCreate';
import { User } from '../Domain/User';
import { UserRepository } from '../Domain/UserRepository';

export class CreateTwitterUser implements InputService {
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
  async execute(twitterUser: ValidUser): any {
    try {
      this.logger.log(`Intentando almacenar ${JSON.stringify(twitterUser)}`);
      await this.repo.createUser(new User(twitterUser));
      return { success: 'true' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
