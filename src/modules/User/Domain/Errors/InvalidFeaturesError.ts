import { CoreError } from '../../../../shared/Error/CoreError';

export class InvalidFeaturesError extends CoreError {
  constructor() {
    super('The Feature dont exist.');
    this.name = 'InvalidFeaturesError';
  }
}
