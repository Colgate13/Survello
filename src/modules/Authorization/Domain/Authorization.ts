import { User } from 'modules/User/Domain/User';
import { InvalidAuthorizationError } from './Errors/InvalidAuthorizationError';
import { features } from './Features';
export class Authorization {
  get features(): string[] {
    return [...features];
  }

  static can(user: User, feature: string): boolean {
    //valid user
    //valid feature

    let hasFeature = false;

    if (user.features.includes(feature)) {
      hasFeature = true;
    }

    if (user.features.includes('ADMIN:ALL') && feature.includes('ADMIN:ALL')) {
      if (!user.email.match(/@velloware.com$/)) hasFeature = false;
    }

    return hasFeature;
  }
}
