import { StringAttribute } from './StringAttribute';
import { InvalidImageError } from './InvalidImageError';

export class Image extends StringAttribute {
  private readonly VALID_IMAGE_REGEX: RegExp = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm,
  );
  readonly value: string;
  constructor(image: string) {
    super();
    this.throwErrorIfEmptyAttribute(image, 'The attribute image can not be empty');
    this.throwErrorIfInvalidEmail(image);
    this.value = image;
  }

  throwErrorIfInvalidEmail(email: string): void {
    if (!this.VALID_IMAGE_REGEX.test(email)) {
      throw new InvalidImageError('Invalid format on the image URL');
    }
  }

  equals(email: Email): boolean {
    return this.value === email.value;
  }
}
