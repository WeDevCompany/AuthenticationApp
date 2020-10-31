import { StringAttribute } from './StringAttribute';

export class To extends StringAttribute {
  readonly value: string;

  constructor(to: string) {
    super();
    this.throwErrorIfEmptyAttribute(to, 'The attribute id can not be empty');
    this.value = to;
  }

  equals(to: To) {
    return this.value === to.value;
  }
}
