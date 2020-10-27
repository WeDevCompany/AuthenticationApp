import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { Logger } from '../../Logger';
import { CreateGoogleUser } from '../Application/CreateGoogleUser';

const PROVIDER = 'google';
const PASSPORT_CONFIG = { scope: ['profile', 'email'] };

@controller('/oauth/google')
export class GoogleController {
  private readonly logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  @httpGet(
    '/callback',
    (request: Request, response: Response, next: NextFunction) => {
      // @ts-ignore
      request.provider = PROVIDER;
      // @ts-ignore
      request.provider_config = PASSPORT_CONFIG;
      // @ts-ignore
      const oauthMiddleware = container.get<RequestHandler>(TYPES.OAuthAutenticationMiddleware);
      oauthMiddleware(request, response, next);
    },
    (request: Request, response: Response, next: NextFunction) => {
      // @ts-ignore
      if (!request.user) {
        console.log('⛔');
        response.sendStatus(401);
      }

      next();
    },
  )
  public callback(request: Request, response: Response, next: NextFunction) {
    // @ts-ignore
    const user = request.user;

    const createGoogleUser = new CreateGoogleUser(this.logger);

    return createGoogleUser.execute({
      id: user._json.sub,
      displayName: user._json.name,
      username: user._json.email,
      image: user._json.picture,
      email: user._json.email,
    });
  }
}
