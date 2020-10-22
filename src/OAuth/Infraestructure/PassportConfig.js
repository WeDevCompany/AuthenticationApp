import { FactoryStrategy } from './FactoryStrategy';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const SlackStrategy = require('passport-slack-oauth2').Strategy;

passport.serializeUser(function(user, done) {
  /*
      From the user take just the id (to minimize the cookie size) and just pass the id of the user
      to the done callback
      PS: You dont have to do it like this its just usually done like this
      */
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  /*
      Instead of user this function usually recives the id
      then you use the id to select the user from the db and pass the user obj to the done callback
      PS: You can later access this data in any routes in: req.user
      */
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  ),
);

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      skipUserProfile: false,
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

//passport.use(FactoryStrategy.getStrategy('Google'));
//passport.use(FactoryStrategy.getStrategy('Slack'));
