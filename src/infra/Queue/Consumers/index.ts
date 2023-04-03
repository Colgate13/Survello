import { IChannel, Queu } from '../RabbitQueu';
import { EmailConsumer } from './Email';
export { EmailConsumer } from './Email';

import { ConfirmationsConsumer } from './Confirmations';
export { ConfirmationsConsumer } from './Confirmations';

export class Consumers {
  private channel: IChannel;
  private emailConsumer: EmailConsumer;
  private confirmationsConsumer: ConfirmationsConsumer;

  constructor(channel: IChannel) {
    this.channel = channel;

    this.emailConsumer = new EmailConsumer(this.channel);
    this.confirmationsConsumer = new ConfirmationsConsumer(this.channel);
  }

  async Start() {
    // await this.emailConsumer.Startconsume();
    await this.confirmationsConsumer.Startconsume();
  }

  async StartOne(name: string) {
    switch (name) {
      case 'email':
        await this.emailConsumer.Startconsume();
        break;
      case 'confirmation':
        await this.confirmationsConsumer.Startconsume();
        break;
      default:
        break;
    }
  }
}

export default {
  EmailConsumer,
  ConfirmationsConsumer,
};
