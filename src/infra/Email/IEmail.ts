export interface IEmail {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface IEmailOptions {
  email: IEmail;
  emailFrom: string;
  testMail?: boolean;
}
