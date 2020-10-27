import { injectable } from 'inversify';
import { Logger } from '../../Logger';

@injectable()
class ConsoleLogger implements Logger {
  private readonly console: any;

  constructor() {
    this.console = console;
  }

  log(message: object): any {
    this.console.log(message);
  }

  error(message: object): any {
    this.console.error(message);
  }

  warn(message: object): any {
    this.console.warn(message);
  }
}

export { ConsoleLogger };
