import { Image } from '../../../OAuth/Domain/Image';

const VALID_IMAGES = [
  'https://unsplash.com/photos/6uneKLGrJPs',
  'https://unsplash.com/photos/npxXWgQ33ZQ',
  'https://unsplash.com/photos/Bd7gNnWJBkU',
];
const INVALID_IMAGES = ['fakeurl.com', 'www.google.com', 'twitter.com'];
const EMPTY_IMAGE = '';

describe('It should validate the Image attribute', () => {
  it('should create a valid image', () => {
    VALID_IMAGES.forEach(mail => {
      expect(new Image(mail).value).toBe(mail);
    });
  });
  it('should fail on creating an image with an empty string', () => {
    expect(() => new Image(EMPTY_IMAGE)).toThrowError(/^EmptyAtributeError.*/);
  });

  it('should fail on creating an image with an invalid image format', () => {
    INVALID_IMAGES.forEach(image => {
      expect(() => new Image(image)).toThrowError(/^InvalidImageError.*/);
    });
  });
});
