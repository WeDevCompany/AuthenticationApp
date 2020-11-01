import { container } from './DependencyInjection';
import './AppControllerRegistry';
import { appMiddleware } from './AppMiddlewares';
import { connection } from '../ormconfig';

export { container, appMiddleware, connection };
