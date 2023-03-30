import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidContentError extends CoreError {
  constructor(errorInfo = 'InvalidContentError') {
    super(`This Content is invalid ${errorInfo}}`);
    this.name = 'InvalidContentError';
  }
}
