import { uidCreate } from '../../../shared/Utils/uid';
import { Entity } from '../../../core/domain/Entity';
import { Either, left, right } from '../../../core/logic/Either';
import { InvalidEmailError } from './Errors/InvalidEmailError';
import { InvalidPasswordError } from './Errors/InvalidPasswordError';
import { InvalidUsernameError } from './Errors/InvalidUsernameError';
import { IUserDTO, IUserView } from './IUser';

export class User extends Entity<IUserDTO> {
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get features(): string[] {
    return this.props.features;
  }

  get country(): string {
    return this.props.country;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get email(): string {
    return this.props.email.value;
  }

  get password(): string {
    return this.props.password.value;
  }

  get user(): IUserView {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }

  private constructor(UserProps: IUserDTO, id?: string) {
    super(UserProps, id || uidCreate());
  }

  static create(
    UserProps: IUserDTO,
    id?: string,
  ): Either<
    InvalidEmailError | InvalidPasswordError | InvalidUsernameError,
    User
  > {
    if (!UserProps.name) {
      return left(new InvalidUsernameError());
    }

    const user = new User(UserProps, id);

    return right(user);
  }

  static instancie(
    UserProps: IUserDTO,
    id: string,
  ): Either<
    InvalidEmailError | InvalidPasswordError | InvalidUsernameError,
    User
  > {
    if (!UserProps.name) {
      return left(new InvalidUsernameError());
    }

    const user = new User(UserProps, id);

    return right(user);
  }
}
