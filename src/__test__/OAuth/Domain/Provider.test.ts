import { Provider } from '../../../OAuth/Domain/Provider';

const VALID_PROVIDER = 'google';
const EMPTY_PROVIDER = '';
const VALID_PROVIDER_UPPERCASE = 'GOOGLE';
const VALID_PROVIDER_UPPERCASE_AND_SPACES = '  GOOGLE  ';
const UNKONW_PROVIDER = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '');

describe('It should validate the provider attribute', () => {
  it('should create a valid provider with the valid data', () => {
    expect(new Provider(VALID_PROVIDER).value).toBe(VALID_PROVIDER);
  });

  it('should create a valid provider with valid data uppercase', () => {
    expect(new Provider(VALID_PROVIDER_UPPERCASE).value).toBe(VALID_PROVIDER);
  });

  it('should create a valid provider with valid data uppercase and spaces', () => {
    expect(new Provider(VALID_PROVIDER_UPPERCASE_AND_SPACES).value).toBe(VALID_PROVIDER);
  });

  it('should fail on creating a provider', () => {
    expect(() => new Provider(EMPTY_PROVIDER)).toThrowError(/^EmptyAtributeError.*/);
  });

  it('should fail on creating a provider', () => {
    expect(() => new Provider(EMPTY_PROVIDER)).toThrowError(/^EmptyAtributeError.*/);
  });

  it('should fail on unkown provider', () => {
    expect(() => new Provider(UNKONW_PROVIDER)).toThrowError(/^InvalidProviderError.*/);
  });
});
