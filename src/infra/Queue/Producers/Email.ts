import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:producer:email');

interface IEmailProps {
  type: string;
  data: {
    to: string;
    subject: string;
    bodyProps: object;
    fromTitle?: string;
  };
}

export class EmailProducer {
  private channel: IChannel;
  private queue: string;

  constructor(channel: IChannel) {
    this.channel = channel;
    this.queue = 'email';
  }

  public async send(props: object | IEmailProps): Promise<void> {
    this.channel.assertQueue(this.queue, {
      durable: true,
    });
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(props)), {
      persistent: true,
    });
    debug(`> EmailProducer send to ${this.queue} - ${JSON.stringify(props)}`);
  }
}
