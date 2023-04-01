import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/Error/AppError';

export function authorize(features: string[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const hasPermission = features.every(feature =>
      request.user.features.includes(feature),
    );

    if (!hasPermission) {
      throw new AppError('You dont Authorize to this route or method', 403);
    }

    return next();
  };
}
