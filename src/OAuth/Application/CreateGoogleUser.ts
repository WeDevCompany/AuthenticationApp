import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
import { User } from '../Domain/User';
import { UserRepository } from '../Domain/UserRepository';
import { ValidUser } from '../Domain/ValidUser';

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

  async execute(googleUser: ValidUser): Promise<any> {
    try {
      this.logger.log(`Intentando almacenar ${JSON.stringify(googleUser)}`);
      await this.repo.createUser(new User(googleUser));
      return { success: 'true' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
