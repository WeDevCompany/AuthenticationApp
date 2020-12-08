import { format, isValid } from 'date-fns';
import { InvalidDateTime } from './InvalidDateTime';

class DateTime {
  private _date: Date | undefined = undefined;
  private STANDARD_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

  private constructor(date: Date) {
    this.throwErrorOnInvalidDate(date);
    this.date = date;
    Object.freeze(this);
  }

  private set date(date: Date) {
    this._date = date;
  }

  private get date(): Date {
    return this._date;
  }

  static fromString(date: string): DateTime {
    return new this(new Date(Date.parse(date)));
  }

  static fromDate(date: Date): DateTime {
    return new this(date);
  }

  static now(): Date {
    return new Date();
  }

  private throwErrorOnInvalidDate(date: Date): void {
    const isValidDate = isValid(date);
    if (undefined === date || null === date || !isValidDate) {
      throw new InvalidDateTime(`date=${date}`);
    }
  }

  toString() {
    return this.dateFormatter();
  }

  toDate(): Date {
    return this._date;
  }

  equals(date: DateTime): Boolean {
    return (
      undefined !== this._date &&
      undefined !== date.date &&
      this._date.getTime() === date.date.getTime()
    );
  }

  private dateFormatter(): string {
    return format(this._date, this.STANDARD_DATE_FORMAT);
  }
}

export { DateTime };
