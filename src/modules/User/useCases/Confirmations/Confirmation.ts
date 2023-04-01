import { User } from '../../../../modules/User/Domain/User';
import { Either, left, right } from '../../../../core/logic/Either';
import {
  comparePassword,
  hashedConfirmation,
} from '../../../../shared/Utils/PassCrypt';
import {
  JWT,
  JWTConfirmationTokenPayload,
} from '../../../../modules/User/Domain/jwt';
import { IUsersRepository } from '../../../../modules/User/repositories/IUsersRepository';

interface IConfirm {
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

  async confirm(jwt: string): Promise<Either<Error, IConfirm>> {
    const jwtPayloadOrError = JWT.verifyAndDecodeConfirmationToken(jwt);

    if (jwtPayloadOrError.isLeft()) return left(jwtPayloadOrError.value);

    const user = await this.userRepository.findById(
      jwtPayloadOrError.value.sub,
    );

    if (!user) return left(new Error('User not found'));

    // Craete a method to compare the token
    // const isMatch = await comparePassword(
    //   jwtPayloadOrError.value.token,
    //   user.confirmation,
    // );

    // if (!isMatch) return left(new Error('Confirmation token does not match'));

    return right({
      jwtDecode: jwtPayloadOrError.value,
      userId: user.id,
      action: jwtPayloadOrError.value.action,
    });
  }
}
