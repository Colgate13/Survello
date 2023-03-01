import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:consumer:email');
import {
  EmailBroadcasting,
  ISendMail,
} from '../../../modules/Broadcasting/useCases/Email/Email';
import { Email } from '../../Email/Email';

export class EmailConsumer {
  private channel: IChannel;
  private queue: string;

  constructor(channel: IChannel) {
    this.channel = channel;
    this.queue = 'email';
  }

  async Startconsume() {
    await this.channel.assertQueue(this.queue, {
      durable: true,
    });
    await this.channel.prefetch(1);
    this.channel.consume(
      this.queue,
      async message => {
        if (!message) return;

        const messageContent: ISendMail = JSON.parse(
          message.content.toString(),
        );

        debug(`> EmailConsumer received from {${this.queue}}`);
        const emailTranponder = await Email.createTransporter();
        const emailBroadcasting = new EmailBroadcasting(emailTranponder);
        emailBroadcasting.sendMail(messageContent);
        debug(`> EmailConsumer sent to {${this.queue}}`);

        this.channel.ack(message);
      },
      {
        noAck: false,
      },
    );
  }
}
