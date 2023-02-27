import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:consumer:email');

export class EmailConsumer {
  private channel: IChannel;
  private queue: string;

  constructor(channel: IChannel) {
    this.channel = channel;
    this.queue = 'email';
  }

  async Startconsume() {
    await this.channel.assertQueue('emails', {
      durable: true,
    });
    await this.channel.prefetch(1);

    this.channel.consume(
      'emails',
      message => {
        if (!message) return;

        const messageContent = JSON.parse(message.content.toString());
        debug(`> EmailConsumer received from {${this.queue}}`);
        const email = messageContent.email;
        const link = messageContent.link;

        console.log(`> EmailConsumer send email to ${email} with link ${link}`);
        this.channel.ack(message);
      },
      {
        noAck: false,
      },
    );
  }
}
