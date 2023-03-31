import { Router, Response, Request } from 'express';
import 'express-async-errors';

import users from './users.routes';

export const routesCreator = Router();

const routes = Router();

routes.use('/users', users);

routes.use('/', (request: Request, response: Response) => {
  response.send({
    message: 'Welcome',
    status: 'ONLINE',
    version: request.version,
    documentation: '/docs',
  });
});

export default routes;
