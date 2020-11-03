import { Provider } from '../../../OAuth/Domain/Provider';

const VALID_PROVIDER = 'google';
const EMPTY_PROVIDER = '';

describe('It should validate the provider attribute', () => {
  it('should create a valid provider', () => {
    expect(new Provider(VALID_PROVIDER).value).toBe(VALID_PROVIDER);
  });
  it('should fail on creating a provider', () => {
    expect(() => new Provider(EMPTY_PROVIDER)).toThrowError(/^EmptyAtributeError.*/);
  });
});
