import { EditUser } from './EditUser';
import { InMemoryUsersRepository } from '../../repositories/InMemory/UsersRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';

import { CreateUser } from '../CreateUser/CreateUser';
import { User } from '../../Domain/User';
import { QueuMock } from '../../../../infra/Queue/RabbitQueueMock';
import { userDontExistError } from '../Errors/userDontExist';

let usersRepository: IUsersRepository;
let editUser: EditUser;
let queuMock: QueuMock;

let createUser: CreateUser;

describe('Edit User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    queuMock = QueuMock.getInstance();
    createUser = new CreateUser(usersRepository, queuMock);
    editUser = new EditUser(usersRepository, queuMock);
  });

  it('should be able a edit user', async () => {
    const newUser = await createUser.create({
      email: 'gabrielbarros13@gmail.com',
      password: '1515mOKC',
      name: 'ColgAate13xx',
    });

    if (newUser.isLeft()) {
      throw new Error('User not created');
    }

    expect(newUser.isRight()).toBe(true);
    expect(newUser.isLeft()).toBe(false);
    expect(newUser.value).toBeInstanceOf(User);
    expect(newUser.value.email).toBe('gabrielbarros13@gmail.com');

    const user = await editUser.edit(newUser.value.id, {
      email: 'gabrielbarros@gmail.com',
    });

    if (user.isLeft()) {
      throw new Error('User not edited');
    }

    expect(user.isRight()).toBe(true);
    expect(user.isLeft()).toBe(false);
    expect(user.value).toBeInstanceOf(User);
    expect(user.value.email).toBe('gabrielbarros@gmail.com');
  });
});
