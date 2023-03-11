import { left, right } from '../../../../../core/logic/Either';
import { InvalidTemplateError } from '../../../Domain/Errors/InvalidTemplateError';
import { InstanceTemplate, InstanceTemplateReturn } from '../InstanceTemplate';
import path from 'path';

interface IImportTemplate {
  hbs: string;
  title: string;
}

type getLocalTemplateProps = {
  templateType: string;
  title?: string;
};

export class GetTemplate {
  constructor() {
    // ...
  }

  async getLocalTemplate({
    templateType,
    title,
  }: getLocalTemplateProps): Promise<InstanceTemplateReturn> {
    if (!templateType) return left(new InvalidTemplateError());

    let templateRawContent: string;
    let titleRawContent = '';
    try {
      const { hbs, title }: IImportTemplate = await import(
        path.resolve(
          path.dirname(''),
          `./dist/infra/Email/Mails/${templateType}.js`,
        )
      );

      if (!hbs || !title)
        return left(
          new InvalidTemplateError(
            `Template not found in local storage: [../../../infra/Email/Mails/${templateType}]`,
          ),
        );

      templateRawContent = hbs;

      if (!title) {
        titleRawContent = title;
      }
    } catch (error) {
      console.log(error);
      return left(
        new InvalidTemplateError(
          `Template not found in local storage: [../../../infra/Email/Mails/${templateType}].ts`,
        ),
      );
    }

    const instanceTemplate = new InstanceTemplate();

    const template = instanceTemplate.instance({
      title: title || titleRawContent,
      content: templateRawContent,
    });

    if (template.isLeft()) {
      return left(template.value);
    }

    return right(template.value);
  }
}
