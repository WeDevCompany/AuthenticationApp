import { InvalidDomainError } from './InvalidDomainError';
import { StringAttribute } from './StringAttribute';

export class Domain extends StringAttribute {
  // TODO: Change regex to take in consideration the need for the top domain after the point
  private readonly VALID_EMAIL_REGEX: RegExp = new RegExp(/^.*[.].*/gm);
  readonly value: string;

  private constructor(domain: string) {
    super();
    this.throwErrorIfEmptyAttribute(domain, 'The attribute domain of the email can not be empty');
    this.throwErrorIfInvalidDomain(domain);
    this.value = domain;
  }

  throwErrorIfInvalidDomain(domain: string): void {
    if (!this.VALID_EMAIL_REGEX.test(domain)) {
      throw new InvalidDomainError('Invalid format on the domain of the email address');
    }
  }

  equals(domain: Domain): boolean {
    return this.value === domain.value;
  }

  static fromEmail(email: string): Domain {
    const getDomainRegex: RegExp = new RegExp(/.*@/gm);
    return new this(email.replace(getDomainRegex, ''));
  }
}
