import { Template } from './Template';
import { InvalidTemplateError } from './Errors/InvalidTemplateError';
import { Content } from './Content';
import { Title } from './Title';

describe('Test Broadcasting Template', () => {
  it('should be a create Template isRight', () => {
    const title = Title.create('Teste 123');
    const content = Content.create('Teste');

    if (content.isLeft() || title.isLeft()) {
      throw Error('content invalid');
    }

    const template = Template.create({
      title: title.value,
      content: content.value,
    });

    if (template.isLeft()) {
      throw Error('template invalid');
    }

    template.value.contentValue = 'Teste {{name}}';
    template.value.titleValue = 'Teste';

    expect(template.value).toBeInstanceOf(Template);
    expect(template.value.title.value).toEqual('Teste');
    expect(template.value.content.compose({ name: 'tt' }).value).toEqual(
      'Teste tt',
    );

    expect(template.value).toBeInstanceOf(Template);

    const tempTitle = Title.create('Title 123');
    const tempContent = Content.create('Content 123');

    if (tempTitle.isLeft() || tempContent.isLeft()) {
      throw Error('title invalid');
    }

    template.value.content = tempContent.value;
    template.value.title = tempTitle.value;

    expect(template.value.title.value).toEqual('Title 123');
    expect(template.value.content.value).toEqual('Content 123');
  });
});
