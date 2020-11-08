import { runInTransaction, initialiseTestTransactions } from 'typeorm-test-transactions';
import { DatabaseConnectionTestConfiguration } from '../../../../ormconfig';
import PROVIDER from '../../../constant/providers';
import { User } from '../../../OAuth/Domain/User';
import { TypeORMUserRepository } from '../../../OAuth/Infraestructure/TypeORMUserRepository';
//@ts-ignore
//require('../../../DatabaseConnection');

initialiseTestTransactions();

describe.skip('Feature1Test', () => {
  let repo: TypeORMUserRepository;
  beforeAll(async () => {
    repo = await new TypeORMUserRepository(DatabaseConnectionTestConfiguration);
  });

  describe('creation of 2 users', () => {
    it(
      'should allow me to create multiple users if the email address is different but name is the same',
      runInTransaction(async () => {
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
      }),
    );
  });
});
