import { injectable } from 'inversify';
import { OAuthAutenticationService } from '../Domain/OauthAutenticationService';
import { FactoryStrategy } from './FactoryStrategy';
const passport = require('passport');

@injectable()
export class PassportOAuthAutenticationService implements OAuthAutenticationService {
  constructor() {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
  }
  getAuthenticator(strategy: string): object {
    return passport.use(FactoryStrategy(strategy).getStrategy());
  }
}
