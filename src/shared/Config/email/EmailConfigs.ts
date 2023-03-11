import { IEmail } from '../../../infra/Email/IEmail';
import dotenv from 'dotenv';
dotenv.config();

const email: IEmail = {
  host: String(process.env.EMAIL_HOST),
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: String(process.env.EMAIL_USER),
    pass: String(process.env.EMAIL_PASS),
  },
};

const from = String(process.env.EMAIL_FROM);

export { email, from };
