import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { passport } from './PassportConfig';
import { OAuthAutenticationService } from '../Domain/OauthAutenticationService';
const PROVIDER = 'google';
const PASSPORT_CONFIG = { scope: ['profile', 'email'] };

@controller('/oauth/google')
export class GoogleController {
  private oauthService: OAuthAutenticationService;

  constructor(oatuhService: OAuthAutenticationService) {
    this.oatuhService = oatuhService;
  }

  @httpGet(
    '/callback',
    passport.authenticate(PROVIDER, PASSPORT_CONFIG),
    (request: Request, response: Response, next: Function) => {
      // @ts-ignore
      if (!request.user) {
        response.sendStatus(401);
      }

      next();
    },
  )
  public callback(request: Request, response: Response, next: Function) {
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
