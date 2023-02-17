const userFetures = [
  'create:user',
  'read:user',
  'read:user:self',
  'read:user:list',
  'update:user',
  'incomplete:user',
  'ban:user',
];

const tokenFetures = [
  'read:activation_token',
  'read:recovery_token',
  'read:email_confirmation_token',
];

const ADMIN = 'ADMIN:ALL';

const sessionFetures = ['create:session', 'read:session'];

const features = new Set([
  ...userFetures,
  ...tokenFetures,
  ...sessionFetures,
  ...ADMIN,
]);

export { features, userFetures, tokenFetures, sessionFetures };
export default { userFetures, tokenFetures, sessionFetures, features };
