import { sign, verify } from 'jsonwebtoken';
import jwtConfig from '../../../shared/Config/jwt/auth';
import { Either, left, right } from '../../../core/logic/Either';
import { InvalidJWTTokenError } from './Errors/InvalidJWTTokenError';
import { User } from './User';

interface JWTData {
  userId: string;
  token: string;
  features: string[];
}

export interface JWTTokenPayload {
  features: string[];
  exp: number;
  sub: string;
}

export interface JWTConfirmationTokenPayload {
  token: string;
  action: string;
  exp: number;
  sub: string;
}

export class JWT {
  public readonly userId: string;
  public readonly token: string;
  public readonly features: string[];

  private constructor({ userId, features, token }: JWTData) {
    this.userId = userId;
    this.token = token;
    this.features = features;
  }

  static verifyAndDecodeToken(
    token: string,
  ): Either<InvalidJWTTokenError, JWTTokenPayload> {
    try {
      const decoded = verify(token, jwtConfig.jwt.secret) as JWTTokenPayload;
      return right(decoded);
    } catch (err) {
      return left(new InvalidJWTTokenError());
    }
  }

  static verifyAndDecodeConfirmationToken(
    token: string,
  ): Either<InvalidJWTTokenError, JWTConfirmationTokenPayload> {
    try {
      const decoded = verify(
        token,
        jwtConfig.jwtConfirmation.secret,
      ) as JWTConfirmationTokenPayload;

      return right(decoded);
    } catch (err) {
      return left(new InvalidJWTTokenError());
    }
  }

  static createFromJWT(token: string): Either<InvalidJWTTokenError, JWT> {
    const jwtPayloadOrError = this.verifyAndDecodeToken(token);

    if (jwtPayloadOrError.isLeft()) {
      return left(jwtPayloadOrError.value);
    }

    const jwt = new JWT({
      userId: jwtPayloadOrError.value.sub,
      features: jwtPayloadOrError.value.features,
      token,
    });

    return right(jwt);
  }

  static createJwtConfirmationToken(
    user: User,
    token: string,
    action: string,
  ): Either<InvalidJWTTokenError, string> {
    const jwtPayloadOrError = sign(
      {
        token,
        action,
      },
      jwtConfig.jwtConfirmation.secret,
      {
        subject: user.id,
        expiresIn: jwtConfig.jwtConfirmation.expiresIn,
      },
    );

    if (!jwtPayloadOrError) {
      return left(new InvalidJWTTokenError());
    }

    return right(jwtPayloadOrError);
  }

  static signUser(user: User): Either<InvalidJWTTokenError, JWT> {
    const token = sign(
      {
        features: user.features,
      },
      jwtConfig.jwt.secret,
      {
        subject: user.id,
        expiresIn: jwtConfig.jwt.expiresIn,
      },
    );

    const jwt = new JWT({ userId: user.id, features: user.features, token });

    return right(jwt);
  }
}
