import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import * as bodyParser from 'body-parser';
import TYPES from './constant/types';
import { UserInMemoryRepository } from './OAuth/Infraestructure/UserInMemoryRepository';
import './ControllerRegistry';
import passport = require('passport');
const cookieSession = require('cookie-session');

// load everything needed to the Container
let container = new Container();
container.bind<UserInMemoryRepository>(TYPES.UserRepository).to(UserInMemoryRepository);

// start the server
let server = new InversifyExpressServer(container);

server.setConfig(app => {
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
      name: 'account-handler',
      keys: ['key1', 'key2'],
    }),
  );
});

try {
  let serverInstance = server.build();
  serverInstance.listen(3000);
} catch (err) {
  console.error(err);
}

console.log('Server started on port 3000 :)');
