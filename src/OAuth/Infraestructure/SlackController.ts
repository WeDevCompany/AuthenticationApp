import { UserRepository } from './../Domain/UserRepository';
import { controller, httpGet, response, requestParam } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { OauthMiddleware } from './OauthMiddleware';
import { CreateSlackUser } from '../Application/CreateSlackUser';
import { Logger } from '../../Logger';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import PROVIDER from '../../constant/providers';
import { DeleteSlackUser } from '../Application/DeleteSlackUser';
const OAUTH_PROVIDER = 'Slack';
const OAUTH_CONFIG = {
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
    const user = request.user.user;

    const createSlackUser = new CreateSlackUser(this.repo, this.logger);

    return createSlackUser.execute({
      id: user.id,
      displayName: user.name,
      username: user.name,
      image: user.image_512,
      email: user.email,
      provider: PROVIDER.SLACK,
    });
  }

  @httpGet('/delete/:id')
  public async delete(@response() response: Response, @requestParam('id') idParam: string) {
    const deleteSlackUser = new DeleteSlackUser(this.repo, this.logger);

    try {
      return await deleteSlackUser.execute(idParam);
    } catch (error) {
      this.logger.error(error);
      response.sendStatus(500);
    }
  }
}
