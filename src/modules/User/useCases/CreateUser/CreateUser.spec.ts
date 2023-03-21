import { Queu } from '../../../../infra/Queue/RabbitQueu';
import { PrismaUsersRepository } from '../../repositories/prisma/UsersRepository';
import { CreateUser } from './CreateUser';

describe('Test User -> UseCase -> CreateUser', () => {
  it('should be a create user isRight', () => {
    const user = {
      name: 'Gabriel Barros',
      email: 'gabreilbarros13@gmail.com',
      password: '123456',
    };

    const channel: Queu = {
      channel: {
        sendToQueue: jest.fn(),
        assertQueue: jest.fn(),
      },
    };

    const createUser = new CreateUser(new PrismaUsersRepository(), {
      channel: {
        sendToQueue: jest.fn(),
        assertQueue: jest.fn(),
      },
    });
  });
});

(async () => {
  console.log('Criando user');
  const user = {
    name: 'Gabriel Barros',
    email: 'gabreilbarros13@gmail.com',
    password: '123456',
  };
  const createUser = new CreateUser(new PrismaUsersRepository());

  console.log(await createUser.create(user));
})();
