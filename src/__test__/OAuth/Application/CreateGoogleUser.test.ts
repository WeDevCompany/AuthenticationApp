import { ConsoleLogger } from '../../../OAuth/Infraestructure/ConsoleLogger';
import { FakeUserRepository } from '../Infraestructure/FakeUserRepository';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';
import { ValidUser } from '../../../OAuth/Domain/ValidUser';
import { User } from '../../../OAuth/Domain/User';

const USERS_DATA: ValidUser[] = [
  {
    id: '1dfgsdfg',
    displayName: 'Della',
    username: 'Cox',
    image: 'https://goole.com',
    email: 'DellaDCox@superrito.com',
    provider: 'GOOGLE',
  },
  {
    id: 'sdfsdf',
    displayName: 'Denn',
    username: 'dsfgff',
    image: 'https://twitter.com',
    email: 'Denn@dsfgff.com',
    provider: 'GOOGLE',
  },
];
describe('It should validate the CreateGoogleUser application service', () => {
  let repository: UserRepository;
  beforeAll(() => {
    const logger = new ConsoleLogger();
    repository = new FakeUserRepository(logger);
  });

  it('should getAll data from the repository', async () => {
    USERS_DATA.forEach(async user => {
      expect(await repository.createUser(new User(user))).toBe(true);
    });
  });

  /*it('should create a new user with valid data', async () => {
          const spy = jest.spyOn(FakeWrite, 'write');
          USERS_DATA.forEach(user => {
              repository.create(user);
              expect(spy).toHaveBeenCalled();
          });
      });*/
});
