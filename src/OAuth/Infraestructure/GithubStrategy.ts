import { Strategy } from '../Domain/Strategy';
const GihubPassportStrategy = require('passport-github2').Strategy;

export class GithubStrategy implements Strategy {
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
