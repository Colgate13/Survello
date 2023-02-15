import { Email } from './Email';
import { Password } from './Password';

export interface IUser {
  name: string;
  country: string;
  postalCode: string;
  features: string[];
  email: Email;
  password: Password;
}

export interface IUserView {
  id: string;
  name: string;
  email: string;
}
