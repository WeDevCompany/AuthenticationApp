import { injectable } from 'inversify';
import { Logger } from '../../Logger';
import 'reflect-metadata';

@injectable()
class ConsoleLogger implements Logger {
  private readonly console: any;

  constructor() {
    this.console = console;
  }

  log(message: object): any {
    const cssLog = 'background-color: #444; color: green; font-wight: bold';
    this.console.log(`%c ${message}`, cssLog);
  }

  error(message: object): any {
    const cssError = 'background-color: #444; color: red; font-wight: bold';
    this.console.error(`%c ${message}`, cssError);
  }

  warn(message: object): any {
    const cssWarn = 'background-color: #444; color: yellow; font-wight: bold';
    this.console.warn(`%c ${message}`, cssWarn);
  }
}

export { ConsoleLogger };
