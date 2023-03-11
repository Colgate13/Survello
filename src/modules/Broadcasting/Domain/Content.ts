import { Either, left, right } from '../../../core/logic/Either';
import { compile } from 'handlebars';
import { InvalidContentError } from './Errors/InvalidContentError';

export class Content {
  private regex = /{{\w.*?}}/gm;
  private content: string;

  get value(): string {
    return this.content;
  }

  set value(value: string) {
    this.content = value;
  }

  public compose(messageContent: unknown) {
    const mailTemplateParse = compile(this.content);

    const messageCompose = mailTemplateParse(messageContent);

    if (!messageCompose || messageCompose.match(this.regex))
      throw new Error('Error to compose message. INTERFACE PROPS NOT MATCH');

    this.content = messageCompose;
  }

  private constructor(content: string) {
    this.content = content;
  }

  static validate(content: string): boolean {
    const regex = /{{\w.*?}}/gm;
    if (!content || !content.match(regex)) {
      return false;
    }

    return true;
  }

  static create(content: string): Either<InvalidContentError, Content> {
    if (!this.validate(content)) {
      return left(new InvalidContentError());
    }

    return right(new Content(content));
  }
}
