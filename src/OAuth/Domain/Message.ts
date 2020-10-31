import { StringAttribute } from './StringAttribute';

export class Message extends StringAttribute {
  readonly value: string;

  constructor(message: string) {
    super();
    this.throwErrorIfEmptyAttribute(message, 'The attribute id can not be empty');
    this.value = message;
  }

  equals(message: Message) {
    return this.value === message.value;
  }
}
