import { StringAttribute } from './StringAttribute';
import { InvalidEmailError } from './InvalidEmailError';
import { Domain } from './Domain';

export class Email extends StringAttribute {
  private readonly VALID_EMAIL_REGEX: RegExp = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm,
  );
  readonly value: string;
  private readonly _domain: Domain;

  constructor(email: string) {
    super();
    this.throwErrorIfEmptyAttribute(email, 'The attribute email can not be empty');
    this.throwErrorIfInvalidEmail(email);
    try {
      this._domain = Domain.fromEmail(email);
    } catch (domainCreationError) {
      throw new InvalidEmailError(
        `An Error has occurred creating a new Email with data ${JSON.stringify(
          email,
        )} - ${domainCreationError}`,
      );
    }
    this.value = email;
  }

  throwErrorIfInvalidEmail(email: string): void {
    if (!this.VALID_EMAIL_REGEX.test(email)) {
      throw new InvalidEmailError('Invalid format on the email address');
    }
  }

  equals(email: Email): boolean {
    return this.value === email.value;
  }

  get domain(): string {
    return this._domain.value;
  }
}
