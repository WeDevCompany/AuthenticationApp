import { DatabaseConnectionTestConfiguration } from '../../../../ormconfig';
import PROVIDER from '../../../constant/providers';
import { User } from '../../../OAuth/Domain/User';
import { TypeORMUserRepository } from '../../../OAuth/Infraestructure/TypeORMUserRepository';
import { Connection, getConnection } from 'typeorm';
import { createDatabaseConnection } from '../../../../test-utils/test-db-connection';

describe('[Integration] TypeORMUserRepository', () => {
  let repo: TypeORMUserRepository;
  let connection: Connection;
  let queryRunner;
  const USER_ORM_TABLE = 'user_orm';

  beforeAll(async () => {
    connection = await createDatabaseConnection();
    queryRunner = connection.createQueryRunner();
    repo = await new TypeORMUserRepository(DatabaseConnectionTestConfiguration);
  });

  afterAll(async () => {
    await queryRunner.query(`TRUNCATE TABLE ${USER_ORM_TABLE}`);
    queryRunner.release();
    await getConnection().close();
  });

  describe('[Integration] TypeORMUserRepository trying to use all the methods of the repository', () => {
    it('should insert a new user', async () => {
      const userToInsert: User = new User({
        idFromProvider: '1',
        displayName: 'Della',
        username: '@Coxi',
        email: 'DellaDCox@superrito.com',
        image: 'https://unsplash.com/photos/6uneKLGrJPs',
        provider: PROVIDER.GOOGLE,
      });
      await repo.createUser(userToInsert);

      const userFromDb: User = await repo.findUserByID(userToInsert.id);
      expect(await userFromDb.equals(userToInsert)).toBe(true);
    });
    it('should delete a user', async () => {
      const userToInsert: User = new User({
        idFromProvider: '2',
        displayName: 'Antonio',
        username: '@Chj',
        email: 'AntonioChj@superrito.com',
        image: 'https://unsplash.com/photos/6uneKLGrJPs',
        provider: PROVIDER.GOOGLE,
      });

      await repo.createUser(userToInsert);
      await repo.deleteUser(userToInsert.id);
      await expect(repo.findUserByID(userToInsert.id)).rejects.toThrow(/^UserNotExists.*/);
    });
  });
});
