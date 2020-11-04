import PROVIDER from '../../constant/providers';
import { InvalidProviderError } from './InvalidProviderError';
import { StringAttribute } from './StringAttribute';

export class Provider extends StringAttribute {
  private readonly EMPTY_ERROR_MESSAGE: string = 'The attribute provider can not be empty';
  readonly value: string;

  constructor(provider: string) {
    super();
    const cleanProvider = this.cleanProvider(provider);
    this.throwErrorIfEmptyAttribute(cleanProvider, this.EMPTY_ERROR_MESSAGE);
    this.throwErrorIfInvaliProvider(cleanProvider);
    this.value = cleanProvider;
  }

  cleanProvider(provider: string): string {
    return provider.trim().toLowerCase();
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
