import { IStrategy } from '../Domain/IStrategy';
const GooglePassportStrategy = require('passport-google-oauth2').Strategy;

const CALLBACK_URL = '/oauth/google/callback';
export class GoogleStrategy implements IStrategy {
  public getStrategy(): object {
    return new GooglePassportStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN_URL}${CALLBACK_URL}`,
        passReqToCallback: true,
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
