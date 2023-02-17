import { User } from './User';
import { Email } from './Email';
import { Password } from './Password';
import { InvalidUsernameError } from './Errors/InvalidUsernameError';

const email = Email.create('gabreilbarros13@gmail.com');
const password = Password.create('84656505');

describe('Test User (Password, Email)', () => {
  it('should be a create user isRight', () => {
    if (email.isLeft()) {
      throw Error('Email invalid');
    }

    if (password.isLeft()) {
      throw Error('Password invalid');
    }

    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['feature1', 'feature2'],
    });

    if (user.isLeft()) {
      throw Error('User don`t create');
    }

    expect(user.isRight()).toEqual(true);
    expect(user.value).toBeInstanceOf(User);
    expect(user.value.email).toEqual('gabreilbarros13@gmail.com');
    expect(user.value.name).toEqual('Gabriel');
    expect(user.value.features).toEqual(['feature1', 'feature2']);
    expect(user.value.country).toEqual('Brazil');
    expect(user.value.postalCode).toEqual('123456');
    expect(user.value.password).toEqual(password.value.value);
  });

  it('should be a create user with ID set in create isRight', () => {
    if (email.isLeft()) {
      throw Error('Email invalid');
    }

    if (password.isLeft()) {
      throw Error('Password invalid');
    }

    const user = User.instancie(
      {
        email: email.value,
        password: password.value,
        name: 'Gabriel',
        country: 'Brazil',
        postalCode: '123456',
        features: ['feature1', 'feature2'],
      },
      'uuidHere',
    );

    if (user.isLeft()) {
      throw Error('User don`t create');
    }

    expect(user.isRight()).toEqual(true);
    expect(user.value.id).toEqual('uuidHere');
    expect(user.value.user).toEqual({
      id: 'uuidHere',
      email: email.value.value,
      name: 'Gabriel',
    });
  });

  it('should be a create user isRight', () => {
    if (email.isLeft()) {
      throw Error('Email invalid');
    }

    if (password.isLeft()) {
      throw Error('Password invalid');
    }

    const user = User.create({
      email: email.value,
      password: password.value,
      name: 'Gabriel',
      country: 'Brazil',
      postalCode: '123456',
      features: ['feature1', 'feature2'],
    });

    if (user.isLeft()) {
      throw Error('User don`t create');
    }

    expect(user.isRight()).toEqual(true);
    expect(user.value).toBeInstanceOf(User);
    expect(user.value.email).toEqual('gabreilbarros13@gmail.com');
    expect(user.value.name).toEqual('Gabriel');
    expect(user.value.password).toEqual(password.value.value);
  });

  it('should be a not create user because name is invalid isLeft', () => {
    if (email.isLeft()) {
      throw Error('Email invalid');
    }

    if (password.isLeft()) {
      throw Error('Password invalid');
    }

    const user = User.instancie(
      {
        email: email.value,
        password: password.value,
        name: '',
        country: 'Brazil',
        postalCode: '123456',
        features: ['feature1', 'feature2'],
      },
      'uuidHere',
    );

    expect(user.isLeft()).toEqual(true);
    expect(user.value).toBeInstanceOf(InvalidUsernameError);
  });

  it('should be a not create user because name is invalid isLeft', () => {
    if (email.isLeft()) {
      throw Error('Email invalid');
    }

    if (password.isLeft()) {
      throw Error('Password invalid');
    }

    const user = User.create(
      {
        email: email.value,
        password: password.value,
        name: '',
        country: 'Brazil',
        postalCode: '123456',
        features: ['feature1', 'feature2'],
      },
      'uuidHere',
    );

    expect(user.isLeft()).toEqual(true);
    expect(user.value).toBeInstanceOf(InvalidUsernameError);
  });
});
