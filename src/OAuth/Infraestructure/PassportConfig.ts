import { FactoryStrategy } from './FactoryStrategy';
const passport = require('passport');

// TODO: DO NOT REMOVE methods need it for the passport js library
passport.serializeUser(function(user, done) {
  done(null, user);
});

// TODO: DO NOT REMOVE methods need it for the passport js library
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(FactoryStrategy('Github').getStrategy());
passport.use(FactoryStrategy('Google').getStrategy());
passport.use(FactoryStrategy('Slack').getStrategy());

export { passport };
