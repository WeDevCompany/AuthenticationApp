import { GoogleStrategy } from './GoogleStrategy';
import { SlackStrategy } from './SlackStrategy';
import { InvalidStrategyError } from '../Domain/InvalidStrategyError';
import { IStrategy } from '../Domain/IStrategy';

export class FactoryStrategy {
  public static getStrategy(strategy: String): IStrategy {
    switch (strategy) {
      case 'Google': {
        return new GoogleStrategy();
      }
      case 'Slack': {
        return new SlackStrategy();
      }
      default: {
        throw new InvalidStrategyError(`the strategy ${strategy} does not exist`);
      }
    }
  }
}
