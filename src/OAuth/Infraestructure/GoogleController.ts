import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction, RequestHandler } from 'express';
//import { passport } from './PassportConfig';
import { OAuthAutenticationService } from '../Domain/OauthAutenticationService';
import { inject } from 'inversify';
import TYPES from '../../constant/types';
const PROVIDER = 'google';
const PASSPORT_CONFIG = { scope: ['profile', 'email'] };
import { container } from '../../DependencyInjection';

@controller('/oauth/google')
export class GoogleController {
  // @ts-ignore
  private readonly oauthService: OAuthAutenticationService;

  constructor(@inject(TYPES.OAuthAutenticationService) oauthService: OAuthAutenticationService) {
    this.oauthService = oauthService;
  }

  @httpGet(
    '/callback',
    //container.get<RequestHandler>(TYPES.OAuthAutenticationMiddleware),
    function(request: Request, response: Response, next: NextFunction) {
      // @ts-ignore
      request.provider = PROVIDER;
      // @ts-ignore
      request.provider_config = PASSPORT_CONFIG;
      // @ts-ignore
      const oauthMiddleware = container.get<RequestHandler>(TYPES.OAuthAutenticationMiddleware);
      oauthMiddleware(request, response, next);
    },
    //passport.authenticate(PROVIDER, PASSPORT_CONFIG),
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
    console.log(request);
    // @ts-ignore
    const user = request.user;
    return response.send(
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
    );
  }
}
