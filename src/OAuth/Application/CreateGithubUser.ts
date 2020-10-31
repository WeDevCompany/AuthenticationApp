import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
import { User } from '../Domain/User';

export class CreateGithubUser implements InputService {
  protected readonly logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  //@ts-ignore
  async execute(githubUser: ValidUser): any {
    try {
      this.logger.log(new User(githubUser));
      return { status: 'success' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
