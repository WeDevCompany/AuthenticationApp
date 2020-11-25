import { DatabaseConnectionTestConfiguration } from '../../../../ormconfig';
import PROVIDER from '../../../constant/providers';
import { User } from '../../../OAuth/Domain/User';
import { TypeORMUserRepository } from '../../../OAuth/Infraestructure/TypeORMUserRepository';
import { Connection, getConnection } from 'typeorm';
import { createDatabaseConnection } from '../../../../test-utils/test-db-connection';

describe('Feature1Test', () => {
  let repo: TypeORMUserRepository;
  let connection: Connection;
  let queryRunner;

  beforeAll(async () => {
    connection = await createDatabaseConnection();
    queryRunner = connection.createQueryRunner();
    repo = await new TypeORMUserRepository(DatabaseConnectionTestConfiguration);
  });

  afterAll(async () => {
    queryRunner.release();
    await getConnection().close();
  });

  beforeEach(async () => {
    // lets now open a new transaction:
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('[Integration] TypeORMUserRepository trying to use all the methods of the repository', () => {
    it('should insert a new user', async () => {
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
    });
    it('should delete a user', async () => {
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
      expect(await userFromDb).toBe(null);
    });
  });
});
