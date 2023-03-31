import amqp, { Options } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

export type IChannel = amqp.Channel;

export class Queu {
  public channel: amqp.Channel;
  private static instance: Queu;

  constructor(channel: amqp.Channel) {
    this.channel = channel;
  }

  static async getInstance(
    rabbitmqConnection?: Options.Connect,
  ): Promise<Queu> {
    if (!Queu.instance) {
      if (!rabbitmqConnection) {
        const {
          RABBITMQ_IP,
          RABBITMQ_HOST_PORT,
          RABBITMQ_USERNAME,
          RABBITMQ_PASSWORD,
        } = process.env;

        rabbitmqConnection = {
          protocol: 'amqp',
          hostname: RABBITMQ_IP,
          port: Number(RABBITMQ_HOST_PORT),
          username: RABBITMQ_USERNAME,
          password: RABBITMQ_PASSWORD,
          vhost: '/',
        };
      }

      const connection = await amqp.connect(rabbitmqConnection);
      const channel = await connection.createChannel();

      Queu.instance = new Queu(channel);
    }

    return Queu.instance;
  }
}
