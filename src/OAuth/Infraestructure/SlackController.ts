import { controller, httpGet } from 'inversify-express-utils';
//import { inject } from 'inversify';
import { Request, Response } from 'express';
const passport = require('passport');
require('./PassportConfig');
const PROVIDER = 'Slack';
const PASSPORT_CONFIG = {
  scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team'],
};

@controller('/oauth/slack')
export class SlackController {
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
    const user = request.user.user;
    // @ts-ignore
    const provider = request.user.provider;
    return response.send(
      `<pre>
            id: ${user.id}
            Nombre completo: ${user.name}
            Foto: ${user.image_512}
            Email: ${user.email}
            Proveedor: ${provider}
            </pre><img alt="avatar" src="${user.image_512}">`,
    );
  }
}
