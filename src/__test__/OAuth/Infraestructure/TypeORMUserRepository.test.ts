//@ts-ignore
require('../../../DatabaseConnection');
//@ts-ignore
import { container, appMiddleware } from './Kernel';
//@ts-ignore
import { UserORM } from '../../../OAuth/Infraestructure/UserORM.entity';
import DatabaseTestingConnection from '../../../DatabaseTestingConnection';
import { DatabaseConnectionTestConfiguration } from '../../../../ormconfig';
import PROVIDER from '../../../constant/providers';
import { User } from '../../../OAuth/Domain/User';
import { TypeORMUserRepository } from '../../../OAuth/Infraestructure/TypeORMUserRepository';

describe('Feature1Test', () => {
  let repo: TypeORMUserRepository;
  const TIMEOUT_FOR_SLOW_TEST: number = 30000;

  beforeAll(async () => {
    await DatabaseTestingConnection.create();
    repo = await new TypeORMUserRepository(DatabaseConnectionTestConfiguration);
  });

  afterAll(async () => {
    await DatabaseTestingConnection.close();
  });

  beforeEach(async () => {
    await DatabaseTestingConnection.clear();
  });

  describe('[Integration] TypeORMUserRepository trying to use all the methods of the repository', () => {
    it(
      'should insert a new user',
      async () => {
        const userToInsert: User = new User({
          id: '1',
          displayName: 'Della',
          username: '@Cox',
          email: 'DellaDCox@superrito.com',
          image: 'https://unsplash.com/photos/6uneKLGrJPs',
          provider: PROVIDER.GOOGLE,
        });
        await repo.createUser(userToInsert);

        const userFromDb: User = await repo.findUserByID('1');
        expect(await userFromDb.equals(userToInsert)).toBe(true);
      },
      TIMEOUT_FOR_SLOW_TEST,
    );
    it(
      'should delete a user',
      async () => {
        const userToInsert: User = new User({
          id: '2',
          displayName: 'Antonio',
          username: '@Chj',
          email: 'AntonioChj@superrito.com',
          image: 'https://unsplash.com/photos/6uneKLGrJPs',
          provider: PROVIDER.GOOGLE,
        });
        await repo.createUser(userToInsert);
        await repo.deleteUser(userToInsert.id);
        const userFromDb: User = await repo.findUserByID(userToInsert.id);
        console.log(userFromDb);
        expect(await userFromDb.equals(userToInsert)).toBe(true);
      },
      TIMEOUT_FOR_SLOW_TEST,
    );
  });
});
