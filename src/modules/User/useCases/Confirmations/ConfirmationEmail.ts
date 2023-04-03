import { Either, left } from '../../../../core/logic/Either';
import { IUsersRepository } from '../../../../modules/User/repositories/IUsersRepository';
import { Confirmation, IConfirm } from './Confirmation';
import Debug from 'debug';

const debug = Debug('app:queue:consumer:Confirmations');

export class ConfirmationEmail {
  protected userRepository: IUsersRepository;

  constructor(UserRepository: IUsersRepository) {
    this.userRepository = UserRepository;
  }

  async confirmEmail(jwt: string): Promise<Either<Error, IConfirm>> {
    const confirmation = new Confirmation(this.userRepository);

    debug(`> ConfirmationsConsumer 777`);
    const confirmOrNot = await confirmation.confirm(jwt);

    if (confirmOrNot.isLeft()) {
      return left(confirmOrNot.value);
    }

    const { action, userId } = confirmOrNot.value;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new Error('User not found'));
    }

    if (action !== 'email-confirmation') {
      return left(new Error('Action not found'));
    }

    const features = user.features;

    if (!features) {
      return left(new Error('features not found'));
    }

    const newFeatures = features.filter(item => item !== 'email:inconfirmed');

    user.props.features = newFeatures;

    await this.userRepository.save(user);

    return confirmOrNot;
  }
}
