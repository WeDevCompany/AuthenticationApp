import { Message } from './Message';
import { To } from './To';
import { ValidNotify } from './VallidNotify';
import { InvalidNotifyError } from './InvalidNotifyError';

export class Notify {
  _message: Message;
  _to?: To;

  private readonly EMPTY_TO: string = '';

  constructor(notify: ValidNotify) {
    try {
      this.message = notify.message;
      this.to = notify.to ? notify.to : this.EMPTY_TO;
    } catch (notifyCreationError) {
      throw new InvalidNotifyError(
        `An Error has occurred creating a new Notify with data ${JSON.stringify(
          notify,
        )} - ${notifyCreationError}`,
      );
    }
  }

  get message(): string {
    return this._message.value;
  }

  set message(message: string) {
    this._message = new Message(message);
  }

  get to(): string {
    return this._to.value;
  }

  set to(to: string) {
    this._to = new To(to);
  }
}
