import { Request, Response } from 'express';
import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { PassportOAuthAutenticationService } from './PassportOAuthAutenticationService';

function PassportOauthMiddleware(request: Request, response: Response, next: Function): any {
  const oauthService = container.get<PassportOAuthAutenticationService>(
    TYPES.OAuthAutenticationService,
  );
  console.log(oauthService);
  next();
}

export { PassportOauthMiddleware };
