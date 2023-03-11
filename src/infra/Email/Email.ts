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
import { Either, left, right } from '../../core/logic/Either';

const debug = Debug('app:email');

export class Email {
  private transporter;
  private emailFrom: string;
  private testAccont: TestAccount | null;

  private constructor(
    email: IEmail,
    emailFrom: string,
    testAccont?: TestAccount | null,
  ) {
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
      tempTransporter = createTransport(email);
    }

    if (!tempTransporter) throw new Error('Email configuration is invalid');

    this.transporter = tempTransporter;
  }

  static async createTransporter(EmailOptionsProps?: IEmailOptions) {
    if (!EmailOptionsProps) {
      const { email, from } = await import(
        '../../shared/Config/email/EmailConfigs'
      );

      EmailOptionsProps = {
        email,
        emailFrom: from,
      };
    }

    let testAccont = null;

    if (EmailOptionsProps.testMail || process.env.NODE_ENV !== 'production') {
      testAccont = await createTestAccount();
    }

    return new Email(
      EmailOptionsProps.email,
      EmailOptionsProps.emailFrom || EmailOptionsProps.email.auth.user,
      testAccont,
    );
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
