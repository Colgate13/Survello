import { Email } from '../../User/Domain/Email';
import { Password } from '../../User/Domain/Password';
import { User } from '../../User/Domain/User';
import { Authorization } from './Authorization';
import { features } from './Features';

const email = Email.create('gabreilbarros13@gmail.com');
const password = Password.create('84656505');

if (email.isLeft()) {
  throw Error('Email invalid');
}

if (password.isLeft()) {
  throw Error('Password invalid');
}

describe('Test Authorization', () => {
  it('should be a can Authorization to create user true', () => {
    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['create:user'],
    });

    if (user.isLeft()) {
      throw Error('User invalid');
    }

    const authorization = Authorization.can(user.value, 'create:user');

    expect(new Authorization().features).toEqual([...features]);
    expect(authorization).toEqual(true);
  });

  it('should be a not can Authorization to ADMIN true', () => {
    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['create:user', 'ADMIN:ALL'],
    });

    if (user.isLeft()) {
      throw Error('User invalid');
    }

    const authorization = Authorization.can(user.value, 'ADMIN:ALL');

    expect(authorization).toEqual(false);
  });
});
