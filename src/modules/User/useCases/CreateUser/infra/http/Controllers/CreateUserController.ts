import { Response, Request } from 'express';
import { PrismaUsersRepository } from '../../../../../repositories/prisma/UsersRepository';
import { AppError } from '../../../../../../../shared/Error/AppError';
import { CreateUser, ICreateUser } from '../../../CreateUser';
import { Authenticator } from '../../../../AuthenticateUser/AuthenticateUser';

export default class CreateUserController {
  public async execute(request: Request, response: Response) {
    const createUsersService = new CreateUser(new PrismaUsersRepository());
    const bodyParams: ICreateUser = request.body;

    if (!bodyParams) {
      throw new AppError('Your request Body is invalid', 400);
    }
    if (!bodyParams.email) {
      throw new AppError(`Email is proprety required ${bodyParams.email}`, 400);
    }
    if (!bodyParams.password) {
      throw new AppError(
        `Password is proprety required ${bodyParams.password}`,
        400,
      );
    }
    if (!bodyParams.name) {
      throw new AppError(`name is proprety required ${bodyParams.name}`, 400);
    }

    const { email, password, name } = bodyParams;

    const result = await createUsersService.create({
      email,
      password,
      name,
    });

    if (result.isLeft()) {
      throw new AppError(`User not created ${result.value.message}`);
    }

    request.debug(`User created -> Id = ${result.value.id}`);
    request.debug(`Logging in User -> Id = ${result.value.id}`);

    const userAuth = await new Authenticator(
      new PrismaUsersRepository(),
    ).authUser({
      email,
      password,
    });

    if (userAuth.isLeft()) {
      return response.json(result.value.user);
    }

    return response.status(201).json({
      ...result.value.user,
      token: userAuth.value.token,
    });
  }
}
