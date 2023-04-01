import { Router, Response, Request } from 'express';
import 'express-async-errors';

import CreateUserController from '../../../modules/User/useCases/CreateUser/infra/http/Controllers/CreateUserController';
import LogInUserController from '../../../modules/User/useCases/AuthenticateUser/infra/http/Controllers/LogInUserController';
import ensureAuthenticated from '../middlewares/EnsureAuthenticated';
import { authorize } from '../middlewares/AuthorizationHandler';

const users = Router();

const createUserController = new CreateUserController();
const logInUserController = new LogInUserController();

// @create new User
users.post('/', createUserController.execute);

// @auth User
users.post('/auth', logInUserController.execute);

// @edit User
users.put(
  '/',
  ensureAuthenticated,
  authorize(['read:user:self', 'create:session']),
  (request: Request, response: Response) => {
    response.send({
      message: 'edit User',
    });
  },
);

// @delete User
users.delete(
  '/',
  ensureAuthenticated,
  authorize(['read:user:self', 'create:session']),
  (request: Request, response: Response) => {
    response.send({
      message: 'Delete User',
    });
  },
);

// @Confirm Token
users.get(
  '/confirmations/confirmation',
  (request: Request, response: Response) => {
    response.send({
      message: 'Confirm Token',
      token: request.query.token,
    });
  },
);

users.use('/', (request: Request, response: Response) => {
  response.send({
    message: 'Welcome to users route',
    status: 'ONLINE',
    version: request.version,
    documentation: '/docs/users',
  });
});

export default users;
