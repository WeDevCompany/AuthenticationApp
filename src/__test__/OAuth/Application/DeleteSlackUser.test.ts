import { ConsoleLogger } from '../../../OAuth/Infraestructure/ConsoleLogger';
import { FakeUserRepository } from '../Infraestructure/FakeUserRepository';
import { UserRepository } from '../../../OAuth/Domain/UserRepository';

const USER_ID = 'msmt453gff23f';

describe('[UNIT] - DeleteUser application service tests', () => {
  let repository: UserRepository;
  beforeAll(() => {
    const logger = new ConsoleLogger();
    repository = new FakeUserRepository(logger);
  });

  it('DeleteUser application service should call the respository', async () => {
    expect(await repository.deleteUser(USER_ID)).toBe(true);
  });
});
