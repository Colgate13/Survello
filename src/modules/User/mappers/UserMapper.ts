import { User as PersistenceUser } from '@prisma/client';

import { Email } from '../Domain/Email';
import { Password } from '../Domain/Password';
import { User } from '../Domain/User';

export class UserMapper {
  static toDomain(raw: PersistenceUser): User | null {
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);

    if (emailOrError.isLeft()) {
      throw new Error('Email value is invalid.');
    }

    if (passwordOrError.isLeft()) {
      throw new Error('Password value is invalid.');
    }

    const featuresDomain: Array<string> = Array.isArray(raw.features)
      ? raw.features
      : raw.features.split(',');

    const userOrError = User.create(
      {
        name: raw.name,
        email: emailOrError.value,
        password: passwordOrError.value,
        country: raw.country,
        postalCode: raw.postalCode,
        features: featuresDomain,
      },
      raw.id,
    );

    if (userOrError.isRight()) {
      return userOrError.value;
    }

    return null;
  }

  static async toPersistence(user: User) {
    const featuresToPesistence = user.features.join(',');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      features: featuresToPesistence,
      country: user.country,
      postalCode: user.postalCode,
      password: await user.props.password.getHashedValue(),
    };
  }
}
