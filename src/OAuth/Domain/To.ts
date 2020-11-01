import { StringAttribute } from './StringAttribute';

export class To extends StringAttribute {
  readonly value: string;

  constructor(to: string) {
    super();
    this.value = to;
  }

  equals(to: To) {
    return this.value === to.value;
  }
}
