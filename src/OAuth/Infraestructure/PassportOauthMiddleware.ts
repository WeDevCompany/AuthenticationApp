import { NextFunction, Request, Response } from 'express';
import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { PassportOAuthAutenticationService } from './PassportOAuthAutenticationService';

function PassportOauthMiddleware(request: Request, response: Response, next: NextFunction): any {
  const oauthService = container.get<PassportOAuthAutenticationService>(
    TYPES.OAuthAutenticationService,
  );
  //console.log(oauthService.getAuthenticator("Google"));
  const passport = oauthService.getAuthenticator('Google');

  // @ts-ignore
  passport.authenticate('google', { scope: ['profile', 'email'] });
  // @ts-ignore
  console.log(
    passport.authenticate('google', { scope: ['profile', 'email'] })(request, response, next),
  );
  //next();
}

export { PassportOauthMiddleware };
