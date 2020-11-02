import { Provider } from './Provider';
import { Image } from './Image';
import { Name } from './Name';
import { Id } from './Id';
import { Email } from './Email';
import { InvalidUserError } from './InvalidUserError';
import { ValidUser } from './ValidUser';
import { UserName } from './UsesrName';

export class User {
  _id: Id;
  _displayName: Name;
  _username: UserName;
  _image: Image;
  _email: Email;
  _provider: Provider;

  constructor(user: ValidUser) {
    // TODO: Refactor it should be able to handle multiple errors
    try {
      this.id = user.id;
      this.displayName = user.displayName;
      this.username = user.username;
      this.image = user.image;
      this.email = user.email;
      this.provider = user.provider;
    } catch (userCreationError) {
      throw new InvalidUserError(
        `An Error has occurred creating a new User with data ${JSON.stringify(
          user,
        )} - ${userCreationError}`,
      );
    }
  }

  get id(): string {
    return this._id.value;
  }

  set id(id: string) {
    this._id = new Id(id);
  }

  get displayName(): string {
    return this._displayName.value;
  }

  set displayName(name: string) {
    this._displayName = new Name(name);
  }

  get username(): string {
    return this._username.value;
  }

  set username(name: string) {
    this._username = new UserName(name);
  }

  get email(): string {
    return this._email.value;
  }

  set email(email: string) {
    this._email = new Email(email);
  }

  get image(): string {
    return this._image.value;
  }

  set image(image: string) {
    this._image = new Image(image);
  }

  get provider(): string {
    return this._provider.value;
  }

  set provider(provider: string) {
    this._provider = new Provider(provider);
  }

  equals(user: ValidUser): boolean {
    const comparator = new User(user);
    return (
      this._id.equals(comparator._id) &&
      this._displayName.equals(comparator._displayName) &&
      this._image.equals(comparator._image) &&
      this._username.equals(comparator._username) &&
      this._email.equals(comparator._email) &&
      this._provider.equals(comparator._provider)
    );
  }
}
