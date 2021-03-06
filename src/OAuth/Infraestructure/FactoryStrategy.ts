import { GoogleStrategy } from './GoogleStrategy';
import { SlackStrategy } from './SlackStrategy';
import { GithubStrategy } from './GithubStrategy';
import { InvalidStrategyError } from '../Domain/InvalidStrategyError';
import { Strategy } from '../Domain/Strategy';

function FactoryStrategy(strategy: string): Strategy {
  const strategyLowerCase = strategy.toLowerCase();
  switch (strategyLowerCase) {
    case 'google': {
      return new GoogleStrategy();
    }
    case 'slack': {
      return new SlackStrategy();
    }
    case 'github': {
      return new GithubStrategy();
    }
    default: {
      throw new InvalidStrategyError(`the strategy ${strategyLowerCase} does not exist`);
    }
  }
}

export { FactoryStrategy };
