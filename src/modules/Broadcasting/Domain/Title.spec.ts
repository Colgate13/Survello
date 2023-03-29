import { InvalidTitleLengthError } from './Errors/InvalidTitleLengthError';
import { Title } from './Title';

describe('Test Broadcasting Title', () => {
  it('should be a create Title isRight', () => {
    const title = Title.create('Teste');

    if (title.isLeft()) {
      throw Error('title invalid');
    }

    expect(title.value).toBeInstanceOf(Title);
    expect(title.value.value).toEqual('Teste');

    title.value.value = 'Teste 2';

    expect(title.value.value).toEqual('Teste 2');
    expect(title.value.value).not.toEqual('Teste');

    if (title.isLeft()) {
      throw Error('title invalid');
    }

    expect(Title.validate(title.value.value)).toEqual(true);
  });

  it('should be a not create Title isLeft', () => {
    const title = Title.create('');

    if (title.isRight()) {
      throw Error('title valid');
    }

    expect(title.value.message).toContain('CoreError > This title');
    expect(title.value).toBeInstanceOf(InvalidTitleLengthError);
  });

  it('should be a not Title valid', () => {
    expect(Title.validate('')).toEqual(false);
  });
});
