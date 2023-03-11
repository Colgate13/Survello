import { IChannel } from '../RabbitQueu';
import Debug from 'debug';
const debug = Debug('app:queue:consumer:email');
import { InstanceTemplate } from '../../../modules/Broadcasting/useCases/Template/InstanceTemplate';
import { Broadcasting } from '../../../modules/Broadcasting/useCases/Broadcasting/Broadcasting';
import { Email } from '../../Email/Email';
import { GetTemplate } from '../../../modules/Broadcasting/useCases/Template/getTemplate/getTemplate';

interface IEmailProps {
  type: string;
  data: {
    to: string;
    subject: string;
    bodyProps: object;
    fromTitle?: string;
  };
}

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
        debug(`> EmailConsumer received from {${this.queue}}`);

        if (!message) return;

        const emailBroadcasting = await Email.createTransporter();

        const messageContent: IEmailProps = JSON.parse(
          message.content.toString(),
        );

        const getTemplate = new GetTemplate();
        const broadcasting = new Broadcasting(emailBroadcasting);
        const template = await getTemplate.getLocalTemplate({
          templateType: messageContent.type,
          title: messageContent?.data?.subject,
        });

        if (!template || template.isLeft()) {
          debug(
            `> EmailConsumer ERROR IN ${this.queue} - Error: ${template.value}`,
          );

          return;
        }

        template.value.content.compose(messageContent?.data?.bodyProps);

        broadcasting.send({
          to: String(messageContent?.data?.to),
          template: template.value,
        });

        this.channel.ack(message);
      },
      {
        noAck: false,
      },
    );
  }
}
