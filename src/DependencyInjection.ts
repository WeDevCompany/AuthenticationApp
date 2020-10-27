import { Container } from 'inversify';
import TYPES from './constant/types';
import { UserInMemoryRepository } from './OAuth/Infraestructure/UserInMemoryRepository';
import { PassportOAuthAutenticationService } from './OAuth/Infraestructure/PassportOAuthAutenticationService';
import { ConsoleLogger } from './OAuth/Infraestructure/ConsoleLogger';

// load everything needed to the Container
let container = new Container();
container.bind<UserInMemoryRepository>(TYPES.UserRepository).to(UserInMemoryRepository);
container
  .bind<PassportOAuthAutenticationService>(TYPES.OAuthAutenticationService)
  .to(PassportOAuthAutenticationService);
container.bind<ConsoleLogger>(TYPES.Logger).to(ConsoleLogger);

export { container };
