import { IChannel, Queu } from '../RabbitQueu';
import { EmailConsumer } from './Email';
export { EmailConsumer } from './Email';

export class Consumers {
  private channel: IChannel;
  private emailConsumer: EmailConsumer;

  constructor(channel: IChannel) {
    this.channel = channel;

    this.emailConsumer = new EmailConsumer(this.channel);
  }

  async Start() {
    await this.emailConsumer.Startconsume();
  }

  async StartOne(name: string) {
    switch (name) {
      case 'email':
        await this.emailConsumer.Startconsume();
        break;
      default:
        break;
    }
  }
}

export default {
  EmailConsumer,
};
