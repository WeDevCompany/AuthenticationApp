import { Container } from 'inversify';
import TYPES from './constant/types';
import * as express from 'express';
import { UserInMemoryRepository } from './OAuth/Infraestructure/UserInMemoryRepository';
import { PassportOAuthAutenticationService } from './OAuth/Infraestructure/PassportOAuthAutenticationService';
import { PassportOauthMiddleware } from './OAuth/Infraestructure/PassportOauthMiddleware';
import { ConsoleLogger } from './OAuth/Infraestructure/ConsoleLogger';

// load everything needed to the Container
let container = new Container();
container
  .bind<express.RequestHandler>(TYPES.OAuthAutenticationMiddleware)
  .toConstantValue(PassportOauthMiddleware);
container.bind<UserInMemoryRepository>(TYPES.UserRepository).to(UserInMemoryRepository);
container
  .bind<PassportOAuthAutenticationService>(TYPES.OAuthAutenticationService)
  .to(PassportOAuthAutenticationService);
container.bind<ConsoleLogger>(TYPES.Logger).to(ConsoleLogger);

export { container };
