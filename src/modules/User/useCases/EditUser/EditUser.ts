import { Email } from '../../Domain/Email';
import { Password } from '../../Domain/Password';
import { Either, left, right } from '../../../../core/logic/Either';
import { User } from '../../Domain/User';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { userDontExistError } from '../Errors/userDontExist';
import { Confirmation } from '../Confirmations/Confirmation';

import { EmailProducer } from '../../../../infra/Queue/Producers/Email';
import { Queu } from '../../../../infra/Queue/RabbitQueu';

export interface IEditUser {
  email?: string;
  name?: string;
  password?: string;
  country?: string;
  postalCode?: string;
}

export type editUserReturns = Either<Error | userDontExistError, User>;

export class EditUser {
  protected userRepository: IUsersRepository;
  private queueInstance: Queu | null;

  constructor(userRepository: IUsersRepository, queueInstance?: Queu) {
    this.userRepository = userRepository;
    this.queueInstance = queueInstance || null;
  }

  async edit(userId: string, EditUser: IEditUser): Promise<editUserReturns> {
    if (!userId || !EditUser) {
      return left(
        new userDontExistError(
          'Your request Body is invalid or User Dont exist',
        ),
      );
    }

    const userToEdit = await this.userRepository.findById(userId);

    if (!userToEdit) {
      return left(new userDontExistError(userId));
    }

    const email = Email.create(EditUser.email || userToEdit.email);
    const password = Password.create(EditUser.password || userToEdit.password);

    if (email.isLeft()) {
      return left(new userDontExistError(userId));
    }

    if (password.isLeft()) {
      return left(new userDontExistError(userId));
    }

    const user = User.create(
      {
        name: EditUser.name || userToEdit.name,
        email: email.value,
        password: password.value,
        country: userToEdit.country,
        postalCode: userToEdit.postalCode,
        features: userToEdit.features,
      },
      userId,
    );

    if (user.isLeft()) {
      throw user.value;
    }

    const features = user.value.features;

    if (EditUser.email && EditUser.email !== userToEdit.email) {
      features.push('email:inconfirmed');

      const token = await Confirmation.createConfirmation(
        user.value,
        'email-confirmation',
      );

      if (token.isLeft()) {
        return left(new Error('Error to create confirmation token'));
      }

      const createLink = `${process.env.APP_URL}/users/confirmations/confirmation?token=${token.value}`;

      const queueInstance = this.queueInstance || (await Queu.getInstance());

      const emailProducer = new EmailProducer(queueInstance.channel);

      if (!emailProducer) return left(new Error('Email Producer not found'));

      emailProducer.send({
        type: 'email-confirmation',
        data: {
          to: user.value.email,
          bodyProps: {
            name: user.value.name,
            email: user.value.email,
            linkConfirm: createLink,
          },
          subject: 'Confirmação de email',
        },
      });
    }

    await this.userRepository.save(user.value);

    if (user.isLeft()) {
      throw user.value;
    }

    return right(user.value);
  }
}
