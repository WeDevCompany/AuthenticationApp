import { ConsoleLogger } from '../../../OAuth/Infraestructure/ConsoleLogger';
import { FakeUserRepository } from '../Infraestructure/FakeUserRepository';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';
import { ValidUser } from '../../../OAuth/Domain/ValidUser';
import { User } from '../../../OAuth/Domain/User';
import PROVIDER from '../../../constant/providers';

const USERS_DATA: ValidUser[] = [
  {
    idFromProvider: '1dfgsdfg',
    displayName: 'Francisco',
    username: 'frank',
    image: 'https://slack.com',
    email: 'Frank@superrito.com',
    provider: PROVIDER.SLACK,
  },
  {
    idFromProvider: 'sdfsdf',
    displayName: 'Taza',
    username: 'polimero',
    image: 'https://slack.com',
    email: 'Taza@dsfgff.com',
    provider: PROVIDER.SLACK,
  },
];
describe('[UNIT] - CreateSlackUser application service', () => {
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
