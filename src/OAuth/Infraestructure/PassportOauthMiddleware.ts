import { NextFunction, Request, Response } from 'express';
import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { PassportOAuthAutenticationService } from './PassportOAuthAutenticationService';

function PassportOauthMiddleware(request: Request, response: Response, next: NextFunction): any {
  const oauthService = container.get<PassportOAuthAutenticationService>(
    TYPES.OAuthAutenticationService,
  );

  // TODO: Refactor when the factory methods use the same name as the passport library
  const authenticator = oauthService.getAuthenticator('Google');

  // @ts-ignore
  authenticator.authenticate(request.provider, request.provider_config)(request, response, next);
}

export { PassportOauthMiddleware };
