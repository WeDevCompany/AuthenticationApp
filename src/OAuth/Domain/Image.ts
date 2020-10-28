import { StringAttribute } from './StringAttribute';
import { InvalidImageError } from './InvalidImageError';

export class Image extends StringAttribute {
  private readonly VALID_IMAGE_REGEX: RegExp = new RegExp(
    /^(https?|http?):\/\/[^\s$.?#].[^\s]*$/gm,
  );
  readonly value: string;
  constructor(image: string) {
    super();
    this.throwErrorIfEmptyAttribute(image, 'The attribute image can not be empty');
    this.throwErrorIfInvalidImage(image);
    this.value = image;
  }

  throwErrorIfInvalidImage(image: string): void {
    if (!this.VALID_IMAGE_REGEX.test(image)) {
      throw new InvalidImageError('Invalid format on the image URL');
    }
  }

  equals(image: Image): boolean {
    return this.value === image.value;
  }
}
