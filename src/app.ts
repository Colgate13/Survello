import { Command } from 'commander';
import Server from './infra/http/server';
import dotenv from 'dotenv';
import Debug from 'debug';

import ProcessController from './infra/process/Controller';
import cluster from 'cluster';

const program = new Command();

export function webServers(multiProcess = false) {
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

// if (process.argv[2] === 'start:app') {
//   app(process.argv[3] === 'multi=true' ? true : false);
// }

program
  .name('Survello')
  .description('Survello CLI \n start -h \t to start help')
  .version('0.0.1');

program
  .command('start')
  .description('Start the survello service')
  .argument('<string>', 'service to start')
  .option('--workers', 'Enable multi-process mode')
  .option('--queueConsumers', 'Start queue consumers')
  .action((str, options) => {
    webServers(options.workers);
  });

program
  .command('start:queue')
  .description('Start the Queue Consumers')
  .action((str, options) => {
    console.log(str);
    console.log(options);
  });

program.parse(process.argv);
