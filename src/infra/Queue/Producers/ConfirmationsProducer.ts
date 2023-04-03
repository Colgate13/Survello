import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:producer:Confirmation');

interface IConfirmationProps {
  jwt: string;
}

export class ConfirmationProducer {
  private channel: IChannel;
  private queue: string;

  constructor(channel: IChannel) {
    this.channel = channel;
    this.queue = 'confirmation';
  }

  public async send(props: object | IConfirmationProps): Promise<boolean> {
    this.channel.assertQueue(this.queue, {
      durable: true,
    });

    const sendOrNot = this.channel.sendToQueue(
      this.queue,
      Buffer.from(JSON.stringify(props)),
      {
        persistent: true,
      },
    );
    debug(
      `> ConfirmationProducer send to ${this.queue} - ${JSON.stringify(props)}`,
    );

    if (!sendOrNot) return false;

    return true;
  }
}
