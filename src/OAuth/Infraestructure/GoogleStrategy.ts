import { IStrategy } from '../Domain/IStrategy';
const GooglePassportStrategy = require('passport-google-oauth2').Strategy;

export class GoogleStrategy implements IStrategy {
  public getStrategy(): object {
    return new GooglePassportStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/oauth/google/callback',
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
