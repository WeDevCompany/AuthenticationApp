import { v4 as uuidv4 } from 'uuid';

export class UUID {
  readonly value: string;

  constructor() {
    this.value = uuidv4();
  }

  equals(id: UUID) {
    return this.value === id.value;
  }
}
