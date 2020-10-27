import TYPES from '../../constant/types';
import { container } from '../../DependencyInjection';
import { PassportOAuthAutenticationService } from './PassportOAuthAutenticationService';

function OauthMiddleware(provider, config) {
  const oauthService = container.get<PassportOAuthAutenticationService>(
    TYPES.OAuthAutenticationService,
  );

  // TODO: Refactor when the factory methods use the same name as the passport library
  const authenticator = oauthService.getAuthenticator(provider);

  // @ts-ignore
  return authenticator.authenticate(provider, config);
}

export { OauthMiddleware };
