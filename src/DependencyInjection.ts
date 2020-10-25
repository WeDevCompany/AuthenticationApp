import { Container } from 'inversify';
import TYPES from './constant/types';
import { UserInMemoryRepository } from './OAuth/Infraestructure/UserInMemoryRepository';

// load everything needed to the Container
let container = new Container();
container.bind<UserInMemoryRepository>(TYPES.UserRepository).to(UserInMemoryRepository);

export { container };
