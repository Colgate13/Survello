import { Either, left, right } from '../../../../core/logic/Either';
import { Template } from '../../Domain/Template';
import { InvalidContentError } from '../../Domain/Errors/InvalidContentError';
import { InvalidTemplateError } from '../../Domain/Errors/InvalidTemplateError';
import { InvalidTitleLengthError } from '../../Domain/Errors/InvalidTitleLengthError';
import { IBroadcastingSender } from './IBroadcasting';

type IBroadcastingReturn = Promise<
  Either<
    InvalidContentError | InvalidTemplateError | InvalidTitleLengthError,
    boolean
  >
>;

interface IBroadcastingCreate {
  template: Template;
  to: string;
}

export class Broadcasting {
  private broadcasting: IBroadcastingSender;

  constructor(broadcasting: IBroadcastingSender) {
    this.broadcasting = broadcasting;
  }

  async send({ to, template }: IBroadcastingCreate): IBroadcastingReturn {
    if (!to || !template) return left(new InvalidTemplateError());

    const sendMessage = await this.broadcasting.send({
      to,
      subject: template.title.value,
      body: template.content.value,
    });

    if (!sendMessage || sendMessage.isLeft())
      return left(new InvalidContentError());

    return sendMessage;
  }
}
