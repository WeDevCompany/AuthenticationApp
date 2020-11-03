import { ConsoleLogger } from '../../../OAuth/Infraestructure/ConsoleLogger';
import { FakeUserRepository } from '../Infraestructure/FakeUserRepository';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';

const USER_ID = '16389273667';

describe('It should validate the DeleteUser application service', () => {
  let repository: UserRepository;
  beforeAll(() => {
    const logger = new ConsoleLogger();
    repository = new FakeUserRepository(logger);
  });

  it('should getAll data from the repository', async () => {
    expect(await repository.deleteUser(USER_ID)).toBe(true);
  });
});
