import PROVIDER from '../../constant/providers';
import { InvalidProviderError } from './InvalidProviderError';
import { StringAttribute } from './StringAttribute';

export class Provider extends StringAttribute {
  private readonly EMPTY_ERROR_MESSAGE: string = 'The attribute provider can not be empty';
  readonly value: string;

  constructor(provider: string) {
    super();
    this.throwErrorIfEmptyAttribute(provider, this.EMPTY_ERROR_MESSAGE);
    this.throwErrorIfInvaliProvider(provider);
    this.value = provider;
  }

  throwErrorIfInvaliProvider(provider: string): void {
    if (!Object.values(PROVIDER).includes(provider)) {
      throw new InvalidProviderError('Unkown provider');
    }
  }

  equals(provider: Provider): boolean {
    return this.value === provider.value;
  }
}
