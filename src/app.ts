import Server from './infra/http/server';
import dotenv from 'dotenv';
import Debug from 'debug';

export function app() {
  const debug = Debug('app:server');
  debug('Starting server...');
  dotenv.config();

  const server = new Server(process.env.PORT || 3380);
  server.start();
}

if (process.argv[2] === 'start:app') {
  app();
}
