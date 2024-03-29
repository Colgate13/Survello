import { FindUser } from './FindUser';
import { InMemoryUsersRepository } from '../../repositories/InMemory/UsersRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';

import { CreateUser } from '../CreateUser/CreateUser';
import { User } from '../../Domain/User';
import { QueuMock } from '../../../../infra/Queue/RabbitQueueMock';
import { userDontExistError } from '../Errors/userDontExist';

let usersRepository: IUsersRepository;
let findUser: FindUser;
let queuMock: QueuMock;

let createUser: CreateUser;

describe('Find User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    findUser = new FindUser(usersRepository);
    queuMock = QueuMock.getInstance();
    createUser = new CreateUser(usersRepository, queuMock);
  });

  it('should be able to find a user', async () => {
    const newUser = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '1515mOKC',
      name: 'ColgAate13xx',
    });

    if (newUser.isLeft()) {
      throw new Error('User not created');
    }

    const user = await findUser.findById({
      id: newUser.value.id,
    });

    expect(user.isRight()).toBe(true);
    expect(user.isLeft()).toBe(false);
    expect(user.value).toBeInstanceOf(User);
  });

  it('should not be able to find a user', async () => {
    const newUser = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '1515mOKC',
      name: 'ColgAate13xx',
    });

    if (newUser.isLeft()) {
      throw new Error('User not created');
    }

    const user = await findUser.findById({
      id: '123',
    });

    expect(user.isRight()).toBe(false);
    expect(user.isLeft()).toBe(true);

    if (user.isRight()) {
      throw new Error('User not created');
    }

    expect(user.value).toBeInstanceOf(userDontExistError);
  });
});
