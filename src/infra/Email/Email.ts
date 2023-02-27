import {
  createTransport,
  getTestMessageUrl,
  createTestAccount,
  TestAccount,
} from 'nodemailer';
import Debug from 'debug';

Debug.selectColor = () => '#00ff00';
const debug = Debug('app:email');

export interface IEmail {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

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

  static async createTransporter(
    email: IEmail,
    emailFrom: string,
    testMail = false,
  ) {
    if (!email.host || !email.port || !email.auth.user || !email.auth.pass)
      throw new Error('Invalid email configuration');

    if (!emailFrom) throw new Error('Invalid email from configuration');

    let testAccont = null;
    if (testMail || process.env.NODE_ENV !== 'production') {
      testAccont = await createTestAccount();
    }

    return new Email(email, emailFrom, testAccont);
  }

  async send(
    to: string,
    subject: string,
    body: string,
    fromTitle = 'Survello',
  ) {
    const message = await this.transporter.sendMail({
      from: `${fromTitle} <${this.emailFrom}>`,
      to,
      subject,
      html: body,
    });
    debug('%O', 'Message sent: %s', message.messageId);
    debug('Preview URL: %s', getTestMessageUrl(message));
  }
}
