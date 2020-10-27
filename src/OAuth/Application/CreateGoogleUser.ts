import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { InputService } from '../../InputService';
import { Logger } from '../../Logger';
import { UserDTO } from '../Infraestructure/UserDTO';

export class CreateGoogleUser implements InputService {
  protected readonly logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  //@ts-ignore
  async execute(googleUser: UserDTO): any {
    try {
      this.logger.log(googleUser);
      return { status: 'success' };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
