import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidTemplateError extends CoreError {
  constructor(error?: string) {
    super(`This template is invalid: ${error}`);
    this.name = 'InvalidTemplateError';
  }
}
