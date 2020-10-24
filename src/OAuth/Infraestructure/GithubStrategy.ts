import { IStrategy } from '../Domain/IStrategy';
const GihubPassportStrategy = require('passport-github2').Strategy;

export class GithubStrategy implements IStrategy {
  public getStrategy(): object {
    return new GihubPassportStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        skipUserProfile: false,
      },
      function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
      },
    );
  }
}
