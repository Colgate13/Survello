import { QueuMock } from '../../../../infra/Queue/RabbitQueueMock';
import { InMemoryUsersRepository } from '../../repositories/InMemory/UsersRepository';
import { CreateUser } from './CreateUser';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { User } from '../../Domain/User';

let usersRepository: IUsersRepository;
let queuMock: QueuMock;
let createUser: CreateUser;

describe('Test User -> UseCase -> CreateUser', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    queuMock = QueuMock.getInstance();
    createUser = new CreateUser(usersRepository, queuMock);
  });

  it('should be a create user isRight', async () => {
    const user = {
      name: 'Gabriel Barros',
      email: 'gabreilbarros13@gmail.com',
      password: '123456',
    };

    const userCreated = await createUser.create(user);

    if (userCreated.isLeft()) {
      throw Error('User don`t create');
    }

    expect(userCreated.isRight()).toEqual(true);
    expect(userCreated.value).toBeInstanceOf(User);
    expect(userCreated.value.email).toEqual('gabreilbarros13@gmail.com');
    expect(userCreated.value.password).toContain('$2b');
  });

  it('should be a not create User isRight - Exsit User', async () => {
    await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '8798777',
      name: 'ColgAate13xx',
    });

    const user = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '123145141',
      name: 'ColgAaaatu',
    });

    if (user.isRight()) {
      throw new Error('User created');
    }

    expect(user.isLeft()).toBeTruthy();
  });

  it('should be a not create User isRight - Email invalid', async () => {
    const user = await createUser.create({
      email: 'gabrielbarros13@',
      password: '1515mOKC',
      name: 'ColgAate13xx',
    });

    if (user.isRight()) {
      throw new Error('User created');
    }

    expect(user.isLeft()).toBeTruthy();
  });

  it('should be a not create User isRight - Password invalid', async () => {
    const user = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '1',
      name: 'ColgAate13xx',
    });

    if (user.isRight()) {
      throw new Error('User created');
    }

    expect(user.isLeft()).toBeTruthy();
  });

  it('should be a not create User isRight - name invalid', async () => {
    const user = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '123456789',
      name: '',
    });

    if (user.isRight()) {
      throw new Error('User created');
    }

    expect(user.isLeft()).toBeTruthy();
  });
});
