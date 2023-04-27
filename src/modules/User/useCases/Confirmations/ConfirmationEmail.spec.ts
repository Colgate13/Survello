import { ConfirmationEmail } from './ConfirmationEmail';
import { InMemoryUsersRepository } from '../../repositories/InMemory/UsersRepository';
import { IUsersRepository } from '../../repositories/IUsersRepository';

import { JWT } from '../../Domain/jwt';

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
    //
  });
});
