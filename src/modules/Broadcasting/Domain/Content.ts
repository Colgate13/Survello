import { Either, left, right } from '../../../core/logic/Either';
import { compile } from 'handlebars';
import { InvalidContentError } from './Errors/InvalidContentError';

export type IContentCompose = {
  [key: string]: string;
};

export class Content {
  private regex = /{{\w.*?}}/gm;
  private content: string;

  get value(): string {
    return this.content;
  }

  set value(value: string) {
    this.content = value;
  }

  public compose(contentToCompose: IContentCompose) {
    if (!Content.validateCompose(this.content, contentToCompose)) {
      throw new InvalidContentError(
        `InvalidContentError to compose message. INTERFACE PROPS NOT MATCH
        contentToCompose: ${JSON.stringify(contentToCompose)}
        content: ${this.content}`,
      );
    }

    const mailTemplateParse = compile(this.content);

    const messageCompose = mailTemplateParse(contentToCompose);

    this.content = messageCompose;
    return this;
  }

  private constructor(content: string) {
    this.content = content;
  }

  static validateString(content: string): boolean {
    if (!content) {
      return false;
    }

    return true;
  }

  static validateCompose(
    content: string,
    contentToCompose: IContentCompose,
  ): boolean {
    let control = true;
    const matches = content.match(/{{(.*?)}}/gm);

    matches?.forEach(match => {
      const key = match.replace('{{', '').replace('}}', '').replace(' ', '');

      if (!contentToCompose[key]) {
        control = false;
      }
    });

    return control;
  }

  static create(content: string): Either<InvalidContentError, Content> {
    if (!this.validateString(content)) return left(new InvalidContentError());

    return right(new Content(content));
  }
}
