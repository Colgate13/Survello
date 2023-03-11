import { Errors } from '../../../../../shared/Error/Errors';

export class BroadcastingError extends Errors {
  constructor(InfraBroadCastingError: string) {
    super(`This broadcasting at ERROR: ${InfraBroadCastingError}`);
    this.name = 'BroadcastingError';
  }
}
