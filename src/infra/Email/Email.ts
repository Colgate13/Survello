import {
  createTransport,
  getTestMessageUrl,
  createTestAccount,
  TestAccount,
} from 'nodemailer';
import Debug from 'debug';
import { IEmail, IEmailOptions } from './IEmail';
import {
  ISend,
  IBroadcastingSenderReturn,
} from '../../modules/Broadcasting/useCases/Broadcasting/IBroadcasting';

import { BroadcastingError } from '../../modules/Broadcasting/useCases/Broadcasting/Errors/BroadcastingError';
import { left, right } from '../../core/logic/Either';

const debug = Debug('app:email');

export class Email {
  private transporter;
  private emailFrom: string;
  private testAccont: TestAccount | null;

  private constructor(
    emailFrom: string,
    email: IEmail | null,
    testAccont?: TestAccount | null,
  ) {
    if (!email && !testAccont)
      throw new Error(
        'Email configuration is invalid please insert Email or TestAccount',
      );

    this.testAccont = testAccont || null;
    this.emailFrom = emailFrom;

    let tempTransporter;
    if (this.testAccont) {
      tempTransporter = createTransport({
        host: this.testAccont.smtp.host,
        port: this.testAccont.smtp.port,
        secure: this.testAccont.smtp.secure,
        auth: {
          user: this.testAccont.user,
          pass: this.testAccont.pass,
        },
      });
    } else {
      if (!email) throw new Error('Email configuration is invalid');

      tempTransporter = createTransport(email);
    }

    if (!tempTransporter) throw new Error('Email configuration is invalid');

    this.transporter = tempTransporter;
  }

  static async createTransporter(EmailOptionsProps?: IEmailOptions) {
    if (process.env.NODE_ENV === 'production') {
      if (!EmailOptionsProps) {
        const { email, from } = await import(
          '../../shared/Config/email/EmailConfigs'
        );

        if (!email || !from) throw new Error('Email configuration is invalid');

        EmailOptionsProps = {
          email,
          emailFrom: from,
        };
      }

      const { email, emailFrom } = EmailOptionsProps;
      if (!email || !emailFrom)
        throw new Error('Email configuration is invalid');

      return new Email(emailFrom, email);
    }

    const testAccount = await createTestAccount();

    return new Email('survello.local@survello.com', null, testAccount);
  }

  async send({
    to,
    subject,
    body,
    fromTitle = 'Survello',
  }: ISend): IBroadcastingSenderReturn {
    try {
      const message = await this.transporter.sendMail({
        from: `${fromTitle} <${this.emailFrom}>`,
        to,
        subject,
        html: body,
      });

      debug('%O', 'Message sent: %s', message.messageId);
      debug('Preview URL: %s', getTestMessageUrl(message));

      return right(true);
    } catch (error: any) {
      debug('%O', 'Error sending email: %s', String(error));
      return left(new BroadcastingError(String(error)));
    }
  }
}
