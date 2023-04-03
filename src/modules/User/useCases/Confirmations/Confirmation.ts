import { User } from '../../../../modules/User/Domain/User';
import { Either, left, right } from '../../../../core/logic/Either';
import { hashedConfirmation } from '../../../../shared/Utils/PassCrypt';
import {
  JWT,
  JWTConfirmationTokenPayload,
} from '../../../../modules/User/Domain/jwt';
import { IUsersRepository } from '../../../../modules/User/repositories/IUsersRepository';
import { Queu } from '../../../../infra/Queue/RabbitQueu';
import { ConfirmationProducer } from '../../../../infra/Queue/Producers/ConfirmationsProducer';
import { ConfirmationEmail } from './ConfirmationEmail';
import Debug from 'debug';

const debug = Debug('app:queue:consumer:Confirmations');

export interface IConfirm {
  jwtDecode: JWTConfirmationTokenPayload;
  userId: string;
  action: string;
}

export class Confirmation {
  protected userRepository: IUsersRepository;

  constructor(UserRepository: IUsersRepository) {
    this.userRepository = UserRepository;
  }

  static async createConfirmation(user: User, action: string) {
    if (!user) return left(new Error('User not found'));
    if (!action) return left(new Error('Action not found'));

    const token = await hashedConfirmation(user.id);

    const jwt = JWT.createJwtConfirmationToken(user, token, action);

    if (jwt.isLeft()) return left(jwt.value);

    return right(jwt.value);
  }

  static async sendToConfirmationQueue(jwt: string): Promise<boolean> {
    const queueInstance = await Queu.getInstance();

    const confirmationProducer = new ConfirmationProducer(
      queueInstance.channel,
    );

    if (!confirmationProducer)
      return Promise.reject(new Error('Confirmation Producer not found'));

    const sendOrNot = await confirmationProducer.send({
      jwt,
    });

    return sendOrNot;
  }

  async confirm(jwt: string): Promise<Either<Error, IConfirm>> {
    const jwtPayloadOrError = JWT.verifyAndDecodeConfirmationToken(jwt);

    if (jwtPayloadOrError.isLeft()) {
      debug(`> ConfirmationsConsumer 3`);

      return left(jwtPayloadOrError.value);
    }

    const user = await this.userRepository.findById(
      jwtPayloadOrError.value.sub,
    );

    if (!user) {
      debug(`> ConfirmationsConsumer 4`);
      return left(new Error('User not found'));
    }

    // Craete a method to compare the token
    // const isMatch = await comparePassword(
    //   jwtPayloadOrError.value.token,
    //   user.confirmation,
    // );

    // if (!isMatch) return left(new Error('Confirmation token does not match'));

    let confirmOrNot: IConfirm;

    /* eslint-disable no-case-declarations */
    switch (jwtPayloadOrError.value.action) {
      case 'email-confirmation':
        const confirmationEmail = new ConfirmationEmail(this.userRepository);

        const confirm = await confirmationEmail.confirmEmail(jwt);

        if (confirm.isLeft()) {
          debug(`> ConfirmationsConsumer 5`);
          return left(confirm.value);
        }

        confirmOrNot = confirm.value;

        break;
      default:
        debug(`> ConfirmationsConsumer 6`);
        return left(new Error('Action not found'));
    }

    if (!confirmOrNot) {
      debug(`> ConfirmationsConsumer 7`);
      return left(new Error('Confirmation not found'));
    }

    return right({
      confirm: true,
      jwtDecode: jwtPayloadOrError.value,
      userId: user.id,
      action: jwtPayloadOrError.value.action,
    });
  }
}
