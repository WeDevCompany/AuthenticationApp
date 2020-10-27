import { injectable } from 'inversify';
import { InvalidOAuthMethod } from '../Domain/InvalidOAuthMethod';
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
    switch (strategy) {
      case 'Google': {
        passport.use(FactoryStrategy('Google').getStrategy());
        return passport;
      }
      case 'Github': {
        return passport.use(FactoryStrategy('Github').getStrategy());
      }
      case 'Slack': {
        return passport.use(FactoryStrategy('Slack').getStrategy());
      }
      default: {
        throw new InvalidOAuthMethod(`the strategy ${strategy} does not exist`);
      }
    }
  }
}
