import * as bodyParser from 'body-parser';
import passport = require('passport');
const cookieSession = require('cookie-session');

// https://stackoverflow.com/questions/47968751/what-is-the-point-of-keys-prop-of-cookie-session-library-for-expressjs
const randomCoockieKey1 = process.env.COOKIE_UUID_KEY1 || Math.random().toString(36);
const randomCoockieKey2 = process.env.COOKIE_UUID_KEY2 || Math.random().toString(36);

const appMiddleware = app => {
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    cookieSession({
      name: 'OAuthHandler',
      keys: [randomCoockieKey1, randomCoockieKey2],
    }),
  );
  return app;
};

export { appMiddleware };
