import { ConfirmationEmail } from './ConfirmationEmail';
import { InMemoryUsersRepository } from '../../repositories/InMemory/UsersRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';

import { CreateUser } from '../CreateUser/CreateUser';
import { User } from '../../Domain/User';
import { QueuMock } from '../../../../infra/Queue/RabbitQueueMock';
import { userDontExistError } from '../Errors/userDontExist';

let usersRepository: IUsersRepository;
let confirmationEmail: ConfirmationEmail;
let queuMock: QueuMock;

let createUser: CreateUser;

describe('Confirmation Email', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    queuMock = QueuMock.getInstance();
    confirmationEmail = new ConfirmationEmail(usersRepository);
    createUser = new CreateUser(usersRepository, queuMock);
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

    const user = await confirmationEmail.confirm(newUser.value);
  });
});
