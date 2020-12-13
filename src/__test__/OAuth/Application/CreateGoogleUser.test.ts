import { ConsoleLogger } from '../../../OAuth/Infraestructure/ConsoleLogger';
import { FakeUserRepository } from '../Infraestructure/FakeUserRepository';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';
import { ValidUser } from '../../../OAuth/Domain/ValidUser';
import { User } from '../../../OAuth/Domain/User';
import PROVIDER from '../../../constant/providers';

const USERS_DATA: ValidUser[] = [
  {
    idFromProvider: '1dfgsdfg',
    displayName: 'Della',
    username: 'Cox',
    image: 'https://goole.com',
    email: 'DellaDCox@superrito.com',
    provider: PROVIDER.GOOGLE,
  },
  {
    idFromProvider: 'sdfsdf',
    displayName: 'Denn',
    username: 'dsfgff',
    image: 'https://twitter.com',
    email: 'Denn@dsfgff.com',
    provider: PROVIDER.GOOGLE,
  },
];
describe('[UNIT] - CreateGoogleUser application service', () => {
  let repository: UserRepository;
  beforeAll(() => {
    const logger = new ConsoleLogger();
    repository = new FakeUserRepository(logger);
  });

  it('It should call the repository to create a new user', () => {
    USERS_DATA.forEach(async user => {
      expect(await repository.createUser(new User(user))).toBe(true);
    });
  });
});
