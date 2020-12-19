import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { Logger } from '../../Logger';
import { CreateTwitterUser } from '../Application/CreateTwitterUser';
import { OauthMiddleware } from './OauthMiddleware';
import { UserRepository } from '../Domain/UserRepository';
import PROVIDER from '../../constant/providers';

const OAUTH_PROVIDER = 'twitter';
const OAUTH_CONFIG = { scope: ['user_friends', 'manage_pages'] };

@controller('/oauth/twitter')
export class TwitterController {
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
    OauthMiddleware(OAUTH_PROVIDER, OAUTH_CONFIG),
    (request: Request, response: Response, next: NextFunction) => {
      // @ts-ignore
      if (!request.user) {
        console.log('⛔');
        response.sendStatus(401);
      }

      next();
    },
  )
  public async callback(request: Request, response: Response, next: NextFunction) {
    // @ts-ignore
    const user = request.user;

    const createTwitterUser = new CreateTwitterUser(this.repo, this.logger);
    try {
      return await createTwitterUser.execute({
        id: user._json.id,
        displayName: user._json.name,
        username: user.username,
        image: user._json.picture,
        email: user._json.email,
        provider: PROVIDER.TWITTER,
      });
    } catch (error) {
      this.logger.error(error);
      response.sendStatus(500);
    }
  }
}
