import { Router, Response, Request } from 'express';
import 'express-async-errors';

import CreateUserController from '../../../modules/User/useCases/CreateUser/infra/http/Controllers/CreateUserController';
const users = Router();

const createUserController = new CreateUserController();

// @create new User
users.post('/', createUserController.execute);

users.use('/', (request: Request, response: Response) => {
  response.send({
    message: 'Welcome to users route',
    status: 'ONLINE',
    version: request.version,
    documentation: '/docs/users',
  });
});

export default users;
