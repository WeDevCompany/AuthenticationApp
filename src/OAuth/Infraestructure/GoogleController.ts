import { controller, httpGet, response, requestParam } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { Logger } from '../../Logger';
import { CreateGoogleUser } from '../Application/CreateGoogleUser';
import { OauthMiddleware } from './OauthMiddleware';
import { UserRepository } from '../Domain/UserRepository';
import PROVIDER from '../../constant/providers';
import { DeleteGoogleUser } from '../Application/DeleteGoogleUser';

const OAUTH_PROVIDER = 'google';
const OAUTH_CONFIG = { scope: ['profile', 'email'] };

@controller('/oauth/google')
export class GoogleController {
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

    const createGoogleUser = new CreateGoogleUser(this.repo, this.logger);
    try {
      return await createGoogleUser.execute({
        idFromProvider: user._json.sub,
        displayName: user._json.name,
        username: user._json.email,
        image: user._json.picture,
        email: user._json.email,
        provider: PROVIDER.GOOGLE,
      });
    } catch (error) {
      this.logger.error(error);
      response.sendStatus(500);
    }
  }

  @httpGet('/delete/:id')
  public async delete(@response() response: Response, @requestParam('id') idParam: string) {
    const deleteGoogleUser = new DeleteGoogleUser(this.repo, this.logger);

    try {
      return await deleteGoogleUser.execute(idParam);
    } catch (error) {
      this.logger.error(error);
      response.sendStatus(404);
    }
  }
}
