import { Content } from './Content';
import { InvalidContentError } from './Errors/InvalidContentError';

describe('Test Broadcasting Content', () => {
  it('should be a create Content isRight', () => {
    const content = Content.create('Teste');

    if (content.isLeft()) {
      throw Error('content invalid');
    }

    expect(content.value).toBeInstanceOf(Content);
    expect(content.value.value).toEqual('Teste');

    content.value.value = 'Teste {{123}}';

    expect(content.value.value).toEqual('Teste {{123}}');
  });

  it('should be a create Content isLeft', () => {
    const content = Content.create('');

    if (content.isRight()) {
      throw Error('content invalid');
    }

    expect(content.value).toBeInstanceOf(InvalidContentError);
  });

  it('should be a create Content with val', () => {
    const content = Content.create('Teste {{name}}');

    if (content.isLeft()) {
      throw Error('content invalid');
    }

    expect(content.value).toBeInstanceOf(Content);
    expect(content.value.value).toEqual('Teste {{name}}');

    content.value.compose({ name: 'Teste' });

    expect(content.value.value).toEqual('Teste Teste');
    expect(Content.validateString(content.value.value)).toEqual(true);
  });

  it('should be a create Content with val BUT COMPONSE WITHOUT', () => {
    const content = Content.create('{{foo}} Teste {{name}}');

    if (content.isLeft()) {
      throw Error('content invalid');
    }

    expect(content.value).toBeInstanceOf(Content);
    expect(content.value.value).toEqual('{{foo}} Teste {{name}}');

    try {
      content.value.compose({ teste: 'Teste' });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidContentError);
    }
  });
});
