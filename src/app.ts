import Server from './infra/http/server';
import dotenv from 'dotenv';
import Debug from 'debug';

import ProcessController from './infra/process/Controller';
import cluster from 'cluster';

export function app(multiProcess = false) {
  const debug = Debug('app:server');
  debug('Starting server...');
  dotenv.config();

  const server = new Server(process.env.PORT || 3380);

  if (cluster.isPrimary && multiProcess) {
    ProcessController.PrimaryProcess();
  } else {
    ProcessController.SetNameWorker();
    server.start();
  }
}

if (process.argv[2] === 'start:app') {
  app(process.argv[3] === 'multi=true' ? true : false);
}
