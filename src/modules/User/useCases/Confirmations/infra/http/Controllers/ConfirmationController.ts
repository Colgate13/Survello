import { Response, Request } from 'express';

import { Confirmation } from '../../../Confirmation';

export default class ConfirmationController {
  public async execute(request: Request, response: Response) {
    const token = String(request.query.token);

    if (!token) {
      return response.status(400).json({
        message: 'Token not provided',
      });
    }

    const result = await Confirmation.sendToConfirmationQueue(token);

    if (!result) {
      return response.status(400).json({
        message: 'Invalid token Or Expired token',
      });
    }

    return response.status(200).json({
      message: 'Confirmation success',
    });
  }
}
