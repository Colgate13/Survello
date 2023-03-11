import { Command } from 'commander';
import Server from './infra/http/server';
import dotenv from 'dotenv';
import Debug from 'debug';

import ProcessController from './infra/process/Controller';
import cluster from 'cluster';

import { Queu } from './infra/Queue/RabbitQueu';
import { Consumers } from './infra/Queue/Consumers/index';

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

export async function queueConsumers(
  multiProcess = false,
  onlyConsumer?: string,
) {
  const debug = Debug('app:queue');
  debug('Starting queue Consumers...');
  dotenv.config();

  if (cluster.isPrimary && multiProcess) {
    ProcessController.PrimaryProcess('SurVello - queu worker');
  } else {
    ProcessController.SetNameWorker('SurVello - queu worker');
    const queu = await Queu.create();
    const consumers = new Consumers(queu.channel);

    if (onlyConsumer) {
      consumers.StartOne(onlyConsumer);
    } else {
      consumers.Start();
    }
  }
}

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

    if (options.queueConsumers) {
      queueConsumers();
    }
  });

program
  .command('start:queue')
  .description('Start the Queue Consumers')
  .option('-o, --one', 'Enable only one queue to on consumer')
  .option('--workers', 'Enable multi-process mode')
  .action((str, options) => {
    queueConsumers(options.workers, options.one);
  });

program.parse(process.argv);
