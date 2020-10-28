import { Container } from 'inversify';
import TYPES from './constant/types';
import { OldUserInMemoryRepository } from './OAuth/Infraestructure/OldUserInMemoryRepository';
import { PassportOAuthAutenticationService } from './OAuth/Infraestructure/PassportOAuthAutenticationService';
import { ConsoleLogger } from './OAuth/Infraestructure/ConsoleLogger';

// load everything needed to the Container
let container = new Container();
container.bind<OldUserInMemoryRepository>(TYPES.UserRepository).to(OldUserInMemoryRepository);
container
  .bind<PassportOAuthAutenticationService>(TYPES.OAuthAutenticationService)
  .to(PassportOAuthAutenticationService);
container.bind<ConsoleLogger>(TYPES.Logger).to(ConsoleLogger);

export { container };
