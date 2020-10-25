import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container, appMiddleware } from './Kernel';
require('dotenv').config();

const PORT = process.env.NODE_PORT || 3000;

// start the server with the container
let server = new InversifyExpressServer(container);

server.setConfig(appMiddleware);

try {
  let serverInstance = server.build();
  serverInstance.listen(PORT);
} catch (err) {
  console.error(err);
}

console.log('Server started on port 3000 :)');
