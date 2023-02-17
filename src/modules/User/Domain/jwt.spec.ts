import { JWT } from './jwt';
import { InvalidJWTTokenError } from './Errors/InvalidJWTTokenError';
import { Email } from './Email';
import { Password } from './Password';
import { User } from './User';

describe('Test JWT', () => {
  const email = Email.create('gabreilbarros13@gmail.com');
  const password = Password.create('84656505');

  if (email.isLeft()) {
    throw Error('Email invalid');
  }

  if (password.isLeft()) {
    throw Error('Password invalid');
  }

  it('should be a create JWT isRight', () => {
    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['feature1', 'feature2'],
    });

    if (user.isLeft()) {
      throw Error('User invalid');
    }

    const jwt = JWT.signUser(user.value);

    if (jwt.isLeft()) {
      throw Error('JWT invalid');
    }

    expect(jwt.value).toBeInstanceOf(JWT);
    expect(jwt.value.features).toEqual(['feature1', 'feature2']);
    expect(jwt.value.userId).toEqual(user.value.id);
  });

  it('should be a mount JWT isRight', () => {
    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['feature1', 'feature2'],
    });

    if (user.isLeft()) {
      throw Error('User invalid');
    }

    const jwt = JWT.signUser(user.value);

    if (jwt.isLeft()) {
      throw Error('JWT invalid');
    }

    expect(jwt.value).toBeInstanceOf(JWT);
    expect(jwt.value.features).toEqual(['feature1', 'feature2']);
    expect(jwt.value.userId).toEqual(user.value.id);

    const jwtMount = JWT.createFromJWT(jwt.value.token);

    if (jwtMount.isLeft()) {
      throw Error('JWT invalid');
    }

    expect(jwtMount.value).toBeInstanceOf(JWT);
    expect(jwtMount.value.features).toEqual(['feature1', 'feature2']);
    expect(jwtMount.value.userId).toEqual(user.value.id);
  });

  it('should be a create JWT isLeft', () => {
    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['feature1', 'feature2'],
    });

    if (user.isLeft()) {
      throw Error('User invalid');
    }

    const jwt = JWT.signUser(user.value);

    if (jwt.isLeft()) {
      throw Error('JWT invalid');
    }

    expect(jwt.value).toBeInstanceOf(JWT);
    expect(jwt.value.features).toEqual(['feature1', 'feature2']);
    expect(jwt.value.userId).toEqual(user.value.id);

    const jwtMount = JWT.createFromJWT('invalid');

    expect(jwtMount.isLeft()).toEqual(true);
    expect(jwtMount.value).toEqual(new InvalidJWTTokenError());
  });
});
