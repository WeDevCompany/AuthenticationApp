import { UserRepository } from './../Domain/UserRepository';
import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { OauthMiddleware } from './OauthMiddleware';
import { Logger } from '../../Logger';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { CreateGithubUser } from '../Application/CreateGithubUser';
const PROVIDER = 'github';
const PASSPORT_CONFIG = {
  scope: ['user:email'],
};

@controller('/oauth/github')
export class GithubController {
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
    const user = request.user;

    const createGithubUser = new CreateGithubUser(this.repo, this.logger);

    const email = user.emails ? user.emails[0].value : null;
    const displayName = user.displayName ? user.displayName : user.username;

    return createGithubUser.execute({
      id: user.id,
      displayName: displayName,
      username: user.username,
      image: user.photos[0].value,
      email: email,
      provider: PROVIDER,
    });
  }
}
