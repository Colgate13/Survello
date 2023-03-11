import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidContentError extends CoreError {
  constructor() {
    super(`This Content is invalid`);
    this.name = 'InvalidContentError';
  }
}
