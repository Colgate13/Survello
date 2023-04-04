import { User } from '../../../../modules/User/Domain/User';

import { JWTConfirmationTokenPayload } from '../../../../modules/User/Domain/jwt';
import { Either, left, right } from '../../../../core/logic/Either';
import { IUsersRepository } from '../../../../modules/User/repositories/IUsersRepository';
import { Confirmation, IConfirmed } from './Confirmation';
import Debug from 'debug';

const debug = Debug('app:queue:consumer:Confirmations');

export class ConfirmationEmail {
  protected userRepository: IUsersRepository;

  constructor(UserRepository: IUsersRepository) {
    this.userRepository = UserRepository;
  }

  async confirm(
    user: User,
    jwtDecoded: JWTConfirmationTokenPayload,
  ): Promise<Either<Error, IConfirmed>> {
    if (!user) {
      return left(new Error('User not found'));
    }

    if (jwtDecoded.action !== 'email-confirmation') {
      return left(new Error('Action not found'));
    }

    const features = user.features;

    if (!features) {
      return left(new Error('features not found'));
    }

    const newFeatures = features.filter(item => item !== 'email:inconfirmed');

    user.props.features = newFeatures;

    await this.userRepository.save(user);

    return right({
      user,
      action: jwtDecoded.action,
      confirmed: true,
    });
  }
}
