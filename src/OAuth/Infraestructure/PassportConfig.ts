import { FactoryStrategy } from './FactoryStrategy';
const passport = require('passport');

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

passport.use(FactoryStrategy('Github').getStrategy());
passport.use(FactoryStrategy('Google').getStrategy());
passport.use(FactoryStrategy('Slack').getStrategy());
