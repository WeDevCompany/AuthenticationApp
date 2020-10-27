import { StringAttribute } from './StringAttribute';

export class UserName extends StringAttribute {
  private readonly EMPTY_ERROR_MESSAGE: string = 'The attribute username can not be empty';
  readonly value: string;

  constructor(usesrName: string) {
    super();
    this.throwErrorIfEmptyAttribute(usesrName, this.EMPTY_ERROR_MESSAGE);
    this.value = usesrName;
  }

  equals(usesrName: UserName): boolean {
    return this.value === usesrName.value;
  }
}
