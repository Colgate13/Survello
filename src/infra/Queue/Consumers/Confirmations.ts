import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:consumer:Confirmations');
import { Confirmation } from '../../../modules/User/useCases/Confirmations/Confirmation';
import { PrismaUsersRepository } from '../../../modules/User/repositories/prisma/UsersRepository';

export class ConfirmationsConsumer {
  private channel: IChannel;
  private queue: string;

  constructor(channel: IChannel) {
    this.channel = channel;
    this.queue = 'confirmation';
  }

  async Startconsume() {
    await this.channel.assertQueue(this.queue, {
      durable: true,
    });
    await this.channel.prefetch(1);
    this.channel.consume(
      this.queue,
      async message => {
        try {
          debug(`> ConfirmationsConsumer received from {${this.queue}}!!!`);

          if (!message) {
            debug(
              `> ConfirmationsConsumer received message null from {${this.queue}}`,
            );
            return;
          }

          const { jwt } = JSON.parse(message.content.toString());

          const confirmation = new Confirmation(new PrismaUsersRepository());
          debug(`> ConfirmationsConsumer !!!`);

          const confirmOrNot = await confirmation.confirm(jwt);
          debug(`> ConfirmationsConsumer ${confirmOrNot}!!!`);

          if (confirmOrNot.isLeft()) {
            debug(
              `> ConfirmationsConsumer ERROR IN ${this.queue} - Error: ${confirmOrNot.value}`,
            );
            return;
          }

          debug(
            `> ConfirmationsConsumer success in ${this.queue} - ${confirmOrNot.value.action}:${confirmOrNot.value.userId}`,
          );

          this.channel.ack(message);
        } catch (error) {
          debug(
            `> ConfirmationsConsumer ERROR IN ${this.queue} - Error: ${error}`,
          );
        }
      },
      {
        noAck: false,
      },
    );
  }
}
