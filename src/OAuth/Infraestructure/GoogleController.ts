import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { Logger } from '../../Logger';
import { UserDTO } from './UserDTO';
import { CreateGoogleUser } from '../Application/CreateGoogleUser';

const PROVIDER = 'google';
const PASSPORT_CONFIG = { scope: ['profile', 'email'] };

@controller('/oauth/google')
export class GoogleController {
  // @ts-ignore
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

    const googleUser = new UserDTO({
      id: user._json.sub,
      displayName: user._json.name,
      username: user._json.email,
      image: user._json.picture,
      email: user._json.email,
    });

    return createGoogleUser.execute(googleUser);

    /*return response.send(
      `<pre>
            id: ${user._json.sub}
            Nombre completo:${user._json.name}
            Nombre: ${user._json.given_name}
            Apellidos: ${user._json.family_name}
            Foto: ${user._json.picture}
            Email: ${user._json.email}
            Email verificado: ${user._json.email_verified}
            Localización: ${user._json.locale}
            Proveedor: ${user.provider || PROVIDER}
            </pre><img alt="avatar" src="${user._json.picture}">`,
    );*/
  }
}
