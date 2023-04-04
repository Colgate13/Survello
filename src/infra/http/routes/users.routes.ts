import { Router, Response, Request } from 'express';
import 'express-async-errors';

import CreateUserController from '../../../modules/User/useCases/CreateUser/infra/http/Controllers/CreateUserController';
import LogInUserController from '../../../modules/User/useCases/AuthenticateUser/infra/http/Controllers/LogInUserController';
import EditUserController from '../../../modules/User/useCases/EditUser/infra/http/Controllers/EditUserController';
import ConfirmationController from '../../../modules/User/useCases/Confirmations/infra/http/Controllers/ConfirmationController';

import ensureAuthenticated from '../middlewares/EnsureAuthenticated';
import { authorize } from '../middlewares/AuthorizationHandler';

const users = Router();

const createUserController = new CreateUserController();
const logInUserController = new LogInUserController();
const editUserController = new EditUserController();
const confirmationController = new ConfirmationController();

// @create new User
users.post('/', createUserController.execute);

// @auth User
users.post('/auth', logInUserController.execute);

// @edit User
users.put(
  '/',
  ensureAuthenticated,
  authorize(['read:user:self', 'create:session']),
  editUserController.execute,
);

// @delete User
// users.delete(
//   '/',
//   ensureAuthenticated,
//   authorize(['read:user:self', 'create:session']),
//   (request: Request, response: Response) => {
//     response.send({
//       message: 'Delete User',
//     });
//   },
// );

// @Confirm Token
users.get('/confirmations/confirmation', confirmationController.execute);

users.use('/', (request: Request, response: Response) => {
  response.send({
    message: 'Welcome to users route',
    status: 'ONLINE',
    version: request.version,
    documentation: '/docs/users',
  });
});

export default users;
