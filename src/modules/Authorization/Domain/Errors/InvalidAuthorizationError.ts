import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidAuthorizationError extends CoreError {
  constructor() {
    super('The Authorization is invalid.');
    this.name = 'InvalidAuthorizationError';
  }
}
