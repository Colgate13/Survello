import { Email } from '../../../../infra/Email/Email';
import {
  ConfirmNewAccontMailHbs,
  NewAccountAndConfirmMailHbs,
} from '../../../../infra/Email/Mails/index';
import handlebars from 'handlebars';

export interface ISendMail {
  name?: string;
  type: string;
  email: string;
  subject: string;
}

export class EmailBroadcasting {
  private email: Email;

  constructor(email: Email) {
    this.email = email;
  }

  async newAccont(sendMail: ISendMail) {
    const mailTemplateParse = handlebars.compile(NewAccountAndConfirmMailHbs);

    if (!sendMail.name)
      sendMail.name = sendMail.email.split('@')[0].replace('.', ' ');

    const html = mailTemplateParse({
      email: sendMail.email,
      name: sendMail.name,
      link: sendMail.email,
    });

    await this.email.send(sendMail.email, 'Bem vindo ao Survello', html);
  }

  async confirmNewMail(sendMail: ISendMail) {
    const mailTemplateParse = handlebars.compile(ConfirmNewAccontMailHbs);

    if (!sendMail.name)
      sendMail.name = sendMail.email.split('@')[0].replace('.', ' ');

    const html = mailTemplateParse({
      email: sendMail.email,
      name: sendMail.name,
      link: sendMail.email,
    });

    await this.email.send(sendMail.email, 'Survello confirme seu email', html);
  }

  async sendMail(sendMail: ISendMail) {
    switch (sendMail.type) {
      case 'newAccount':
        await this.newAccont(sendMail);
        break;
      case 'confirmNewMail':
        await this.confirmNewMail(sendMail);
        break;
      default:
        break;
    }
  }
}
