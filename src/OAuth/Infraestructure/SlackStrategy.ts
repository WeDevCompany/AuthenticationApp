import { Strategy } from '../Domain/Strategy';
const SlackPassportStrategy = require('passport-slack-oauth2').Strategy;

export class SlackStrategy implements Strategy {
  public getStrategy(): object {
    return new SlackPassportStrategy(
      {
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        skipUserProfile: false,
      },
      function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
      },
    );
  }
}
