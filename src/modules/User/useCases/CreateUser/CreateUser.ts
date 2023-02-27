export class CreateUser {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ) { }

  async execute({ name, email, password }: IRequest): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    await this.usersRepository.create({
      name,
      email,
      password,
    });

    await this.mailProvider.sendMail({
      to: {
        name,
        email,
      },
      from: {
        name: 'Equipe do meu app',
        email: 'velloware@velloware.com',
      },
      subject: 'Seja bem-vindo à plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma</p>',
    });

    return;
  }
}
