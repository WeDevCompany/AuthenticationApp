import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { passport } from './PassportConfig';
const PROVIDER = 'github';
const PASSPORT_CONFIG = {
  scope: ['user:email'],
};

@controller('/oauth/github')
export class GithubController {
  @httpGet(
    '/callback',
    passport.authenticate(PROVIDER, PASSPORT_CONFIG),
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
    const email = user.emails ? user.emails[0].value : null;
    return response.send(
      `<pre>
             id: ${user.id}
             NodeId: ${user.nodeId}
             Nombre completo: ${user.displayName}
             User: ${user.username}
             Foto: ${user.photos[0].value}
             Email: ${email}
             Proveedor: ${user.provider || PROVIDER}
             </pre><img alt="avatar" src="${user.photos[0].value}">`,
    );
  }
}
