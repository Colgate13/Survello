import { Entity } from '../../../core/domain/Entity';
import { Either, left, right } from '../../../core/logic/Either';
import { Content } from './Content';
import { InvalidTemplateError } from './Errors/InvalidTemplateError';
import { Title } from './Title';

interface ITemplate {
  title: Title;
  content: Content;
}

export class Template extends Entity<ITemplate> {
  private constructor(templateProps: ITemplate, id?: string) {
    super(templateProps, id);
  }

  get title(): Title {
    return this.props.title;
  }
  get content(): Content {
    return this.props.content;
  }

  set content(content: Content) {
    this.props.content = content;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set title(title: Title) {
    this.props.title = title;
  }

  set titleValue(title: string) {
    this.props.title.value = title;
  }

  set contentValue(content: string) {
    this.props.content.value = content;
  }

  static create(
    templateProps: ITemplate,
    id?: string,
  ): Either<InvalidTemplateError, Template> {
    if (!templateProps) {
      return left(new InvalidTemplateError());
    }

    return right(new Template(templateProps, id));
  }
}
