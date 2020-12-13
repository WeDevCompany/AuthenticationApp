import PROVIDER from '../../../constant/providers';
import { User } from '../../../OAuth/Domain/User';
import { ValidUser } from '../../../OAuth/Domain/ValidUser';

const DATA = [
  {
    idFromProvider: '1',
    displayName: 'Della',
    username: '@Cox',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: PROVIDER.GOOGLE,
  },
  {
    idFromProvider: '2',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: PROVIDER.GITHUB,
  },
  {
    idFromProvider: '3',
    displayName: 'sdf kasjdfh ',
    username: '@sdfsdf',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: PROVIDER.SLACK,
  },
];

const VALID_USER_DATA: ValidUser[] = new Array<ValidUser>(...DATA);

const INVALID_DATA = [
  {
    idFromProvider: '',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: 'google',
  },
  {
    idFromProvider: '2',
    displayName: '',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: 'google',
  },
  {
    idFromProvider: '3',
    displayName: 'ksjdfh kasjdfh ',
    username: '',
    email: 'DellaDCox@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: 'google',
  },
  {
    idFromProvider: '4',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: '@superrito.com',
    image: 'https://unsplash.com/photos/6uneKLGrJPs',
    provider: 'google',
  },
  {
    idFromProvider: '5',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: '',
    provider: 'google',
  },
  {
    idFromProvider: '6',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: 'fakeurl.com',
    provider: 'GOOGLE',
  },
  {
    idFromProvider: '7',
    displayName: 'ksjdfh kasjdfh ',
    username: '@lsdkfjlksjdf',
    email: 'DellaDCox@superrito.com',
    image: 'fakeurl.com',
    provider: '',
  },
];

const INVALID_USER_DATA: ValidUser[] = new Array<ValidUser>(...INVALID_DATA);

const USER_JSON: ValidUser = {
  idFromProvider: '1',
  displayName: 'Della',
  username: '@Cox',
  email: 'DellaDCox@superrito.com',
  image: 'https://unsplash.com/photos/6uneKLGrJPs',
  provider: 'google',
};

describe('It should create users with the correct data', () => {
  it('should create a valid User', () => {
    VALID_USER_DATA.forEach(user => {
      expect(new User(user).equals(user)).toBe(true);
    });
  });

  it('should return a valid JSON from a user', () => {
    expect(
      new User({
        idFromProvider: '1',
        displayName: 'Della',
        username: '@Cox',
        email: 'DellaDCox@superrito.com',
        image: 'https://unsplash.com/photos/6uneKLGrJPs',
        provider: PROVIDER.GOOGLE,
      }).equals(USER_JSON),
    ).toBe(true);
  });

  it('should fail to create a valid User based on wrong data', () => {
    INVALID_USER_DATA.forEach(user => {
      expect(() => new User(user)).toThrowError(/^InvalidUserError.*/);
    });
  });
});
