import { UserRepository } from './../Domain/UserRepository';
import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { OauthMiddleware } from './OauthMiddleware';
import { CreateSlackUser } from '../Application/CreateSlackUser';
import { Logger } from '../../Logger';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
const PROVIDER = 'Slack';
const PASSPORT_CONFIG = {
  scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team'],
};

@controller('/oauth/slack')
export class SlackController {
  private readonly logger: Logger;
  private readonly repo: UserRepository;

  constructor(
    @inject(TYPES.UserRepository) repo: UserRepository,
    @inject(TYPES.Logger) logger: Logger,
  ) {
    this.logger = logger;
    this.repo = repo;
  }

  @httpGet(
    '/callback',
    OauthMiddleware(PROVIDER, PASSPORT_CONFIG),
    (request: Request, response: Response, next: NextFunction) => {
      // @ts-ignore
      if (!request.user) {
        response.sendStatus(401);
      }
      next();
    },
  )
  public callback(request: Request, response: Response, next: NextFunction) {
    // @ts-ignore
    const user = request.user.user;

    const createSlackUser = new CreateSlackUser(this.repo, this.logger);

    return createSlackUser.execute({
      id: user.id,
      displayName: user.name,
      username: user.name,
      image: user.image_512,
      email: user.email,
      provider: PROVIDER,
    });
  }
}
