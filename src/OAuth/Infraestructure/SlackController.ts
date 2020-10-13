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
    (req: Request, res: Response, next: Function) => {
      //console.log(req);
      // @ts-ignore
      req.session.user = req.user;
      // @ts-ignore
      //console.log(req.user);
      res.redirect('good');
    },
  )
  public callback() {}

  @httpGet('/good', (request: Request, response: Response, next: Function) => {
    // @ts-ignore
    //console.log(request);
    // @ts-ignore
    if (!request.session.passport.user) {
      response.sendStatus(401);
    }

    next();
  })
  public hasOAuthUser(request: Request, response: Response) {
    // @ts-ignore
    const user = request.session.user;
    console.log(user);
    return response.send(
      `<pre>
            id: ${user._json.id}
            Nombre completo:${user._json.name}
            Foto: ${user._json.image_512}
            Email: ${user._json.email}
            Proveedor: ${user.provider}
            </pre><img alt="avatar" src="${user._json.image_512}">`,
    );
  }
}
