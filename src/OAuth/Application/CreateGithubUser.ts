import { UserRepository } from './../Domain/UserRepository';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
import { User } from '../Domain/User';

export class CreateGithubUser implements InputService {
  protected readonly logger: Logger;
  private readonly repo: UserRepository;

  constructor(
    @inject(TYPES.UserRepository) repo: UserRepository,
    @inject(TYPES.Logger) logger: Logger,
  ) {
    this.repo = repo;
    this.logger = logger;
  }

  //@ts-ignore
  async execute(githubUser: ValidUser): any {
    try {
      this.logger.log(`Intentando almacenar ${JSON.stringify(githubUser)}`);
      this.repo.createUser(new User(githubUser));
      return { status: 'success' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
