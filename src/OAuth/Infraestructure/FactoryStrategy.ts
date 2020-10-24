import { GoogleStrategy } from './GoogleStrategy';
import { SlackStrategy } from './SlackStrategy';
import { GithubStrategy } from './GithubStrategy';
import { InvalidStrategyError } from '../Domain/InvalidStrategyError';
import { IStrategy } from '../Domain/IStrategy';

function FactoryStrategy(strategy: String): IStrategy {
  switch (strategy) {
    case 'Google': {
      return new GoogleStrategy();
    }
    case 'Slack': {
      return new SlackStrategy();
    }
    case 'Github': {
      return new GithubStrategy();
    }
    default: {
      throw new InvalidStrategyError(`the strategy ${strategy} does not exist`);
    }
  }
}

export { FactoryStrategy };
