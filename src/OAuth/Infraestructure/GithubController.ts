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
  @httpGet('/')
  public index(request: Request, response: Response, next: Function) {
    return response.send("holaaaaaaaS");
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
    const user = request.user.user;
    // @ts-ignore
    const provider = request.user.provider;
    return response.send(
      `<pre>
            id: ${user.id}
            Nombre completo: ${user.name}
            Foto: ${user.image_512}
            Email: ${user.email}
            Proveedor: ${provider || PROVIDER}
            </pre><img alt="avatar" src="${user.image_512}">`,
    );
  }
}
