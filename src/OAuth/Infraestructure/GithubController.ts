import { UserRepository } from './../Domain/UserRepository';
import { controller, httpGet, response, requestParam } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { OauthMiddleware } from './OauthMiddleware';
import { Logger } from '../../Logger';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { CreateGithubUser } from '../Application/CreateGithubUser';
import PROVIDER from '../../constant/providers';
import { DeleteGithubUser } from '../Application/DeleteGithubUser';
const OAUTH_PROVIDER = 'github';
const OAUTH_CONFIG = {
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
    OauthMiddleware(OAUTH_PROVIDER, OAUTH_CONFIG),
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
      provider: PROVIDER.GITHUB,
    });
  }

  @httpGet('/delete/:id')
  public async delete(@response() response: Response, @requestParam('id') idParam: string) {
    const deleteGithubUser = new DeleteGithubUser(this.repo, this.logger);

    try {
      return await deleteGithubUser.execute(idParam);
    } catch (error) {
      this.logger.error(error);
      response.sendStatus(500);
    }
  }
}
