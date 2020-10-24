import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
const passport = require('passport');
require('./PassportConfig');
const PROVIDER = 'github';
const PASSPORT_CONFIG = {
  scope: ['user:email'],
};

@controller('/oauth/github')
export class GithubController {
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
             id: ${user.id}
             NodeId: ${user.nodeId}
             Nombre completo: ${user.displayName}
             User: ${user.username}
             Foto: ${user.photos[0].value}
             Email: ${user.emails?.value}
             Proveedor: ${user.provider || PROVIDER}
             </pre><img alt="avatar" src="${user.photos[0].value}">`,
    );
  }
}
