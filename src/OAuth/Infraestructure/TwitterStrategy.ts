import { Strategy } from '../Domain/Strategy';
const TwitterPassportStrategy = require('passport-twitter').Strategy;

const TWITTER_CALLBACK_URL = '/oauth/twitter/callback';
export class TwitterStrategy implements Strategy {
  public getStrategy(): object {
    return new TwitterPassportStrategy(
      {
        consumerKey: process.env.TWITTER_CLIENT_ID,
        consumerSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN_URL}${TWITTER_CALLBACK_URL}`,
        includeEmail: true,
      },
      function(request, accessToken, refreshToken, profile, done) {
        /*
                use the profile info (mainly profile id) to check if the user is registerd in ur db
                If yes select the user and pass him to the done callback
                If not create the user and then select him and pass to callback
            */
        return done(null, profile);
      },
    );
  }
}
