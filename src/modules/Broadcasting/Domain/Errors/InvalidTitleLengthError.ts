import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidTitleLengthError extends CoreError {
  constructor() {
    super(`This title is invalid because TitleLength`);
    this.name = 'InvalidTemplateError';
  }
}
