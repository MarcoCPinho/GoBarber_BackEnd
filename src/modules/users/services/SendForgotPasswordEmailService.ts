import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotEmailPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  async execute({ email }: IRequestDTO): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (!checkUserExists) {
      throw new AppError('User does not exists');
    }

    await this.userTokensRepository.generate(checkUserExists.id);

    await this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido',
    );
  }
}
export default SendForgotEmailPasswordService;
