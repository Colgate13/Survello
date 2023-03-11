import { Either, left, right } from '../../../../core/logic/Either';
import { Template } from '../../Domain/Template';
import { Content } from '../../Domain/Content';
import { Title } from '../../Domain/Title';
import { InvalidContentError } from '../../Domain/Errors/InvalidContentError';
import { InvalidTemplateError } from '../../Domain/Errors/InvalidTemplateError';
import { InvalidTitleLengthError } from '../../Domain/Errors/InvalidTitleLengthError';

export type InstanceTemplateReturn = Either<
  InvalidContentError | InvalidTemplateError | InvalidTitleLengthError,
  Template
>;

interface IInstanceTemplate {
  title: string;
  content: string;
}

export class InstanceTemplate {
  constructor() {
    // ...
  }

  instance({ title, content }: IInstanceTemplate): InstanceTemplateReturn {
    if (
      !title ||
      !content ||
      typeof title !== 'string' ||
      typeof content !== 'string'
    )
      return left(new InvalidTemplateError());

    const titleOrError = Title.create(title);
    const contentOrError = Content.create(content);

    if (titleOrError.isLeft()) {
      return left(titleOrError.value);
    }

    if (contentOrError.isLeft()) {
      return left(contentOrError.value);
    }

    const templateOrError = Template.create({
      title: titleOrError.value,
      content: contentOrError.value,
    });

    if (templateOrError.isLeft()) {
      return left(templateOrError.value);
    }

    return right(templateOrError.value);
  }
}
