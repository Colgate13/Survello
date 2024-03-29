import { uidCreate } from '../../../../shared/Utils/uid';
import { Either, left, right } from '../../../../core/logic/Either';
import { Email } from '../../Domain/Email';
import { InvalidEmailError } from '../../Domain/Errors/InvalidEmailError';
import { InvalidPasswordError } from '../../Domain/Errors/InvalidPasswordError';
import { Password } from '../../Domain/Password';
import { User } from '../../Domain/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AccountAlreadyExistsError } from '../Errors/AccountAlreadyExistsError';

import { EmailProducer } from '../../../../infra/Queue/Producers/Email';
import { Queu } from '../../../../infra/Queue/RabbitQueu';

import { Confirmation } from '../Confirmations/Confirmation';

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

type CreateUserReturn = Either<InvalidEmailError | InvalidPasswordError, User>;

export class CreateUser {
  protected userRepository: IUsersRepository;
  private queueInstance: Queu | null;

  constructor(UserRepository: IUsersRepository, queueInstance?: Queu) {
    this.userRepository = UserRepository;
    this.queueInstance = queueInstance || null;
  }

  async create({
    email,
    password,
    name,
  }: ICreateUser): Promise<CreateUserReturn> {
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const queueInstance = this.queueInstance || (await Queu.getInstance());

    const emailProducer = new EmailProducer(queueInstance.channel);

    if (!emailProducer)
      return left(new InvalidEmailError('Email Producer not found'));

    await passwordOrError.value.setHashPassword();

    const userOrError = User.create(
      {
        email: emailOrError.value,
        password: passwordOrError.value,
        name: name,
        country: '',
        postalCode: '',
        features: [
          'read:user:self',
          'update:user:self',
          'email:inconfirmed',
          'plan:noset',

          'read:activation_token',
          'read:recovery_token',
          'read:email_confirmation_token',

          'create:session',
          'read:session',
        ],
      },
      uidCreate(),
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const userAlredyExists = await this.userRepository.exists(user.email);

    if (userAlredyExists) {
      return left(new AccountAlreadyExistsError(user.email));
    }

    const token = await Confirmation.createConfirmation(
      user,
      'email-confirmation',
    );

    if (token.isLeft())
      return left(new Error('Error to create confirmation token'));

    await this.userRepository.create(user);

    const createLink = `${process.env.APP_URL}/users/confirmations/confirmation?token=${token.value}`;

    emailProducer.send({
      type: 'email-confirmation-newUser',
      data: {
        to: user.email,
        bodyProps: {
          name: user.name,
          email: user.email,
          linkConfirm: createLink,
        },
        subject: 'Confirmação de email',
      },
    });

    return right(user);
  }
}
