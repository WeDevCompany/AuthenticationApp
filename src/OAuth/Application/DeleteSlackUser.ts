import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
import { UserRepository } from '../Domain/UserRepository';

export class DeleteSlackUser implements InputService {
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
  async execute(id: string): Promise<any> {
    try {
      this.logger.log(`Intentando borrar ${JSON.stringify(id)}`);
      await this.repo.deleteUser(id);
      return { success: 'true' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
