import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/Error/AppError';
import { JWT } from '../../../modules/User/Domain/jwt';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      'You dont Permission to this route: TOKEN IS MISSING',
      403,
    );
  }

  const [, token] = authHeader.split(' ');

  try {
    const VerifyAndToken = JWT.verifyAndDecodeToken(token);

    if (VerifyAndToken.isLeft()) throw new AppError('Invalid JWT token', 403);

    const { sub, features } = VerifyAndToken.value;

    request.user = {
      id: sub,
      features: features,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 403);
  }
}
