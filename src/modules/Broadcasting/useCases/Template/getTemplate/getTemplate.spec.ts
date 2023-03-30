import { GetTemplate } from './getTemplate';

describe('Test Broadcasting getTemplate', () => {
  it('should be a create getTemplate isRight', () => {
    const getTemplate = new GetTemplate();

    expect(getTemplate).toBeInstanceOf(GetTemplate);
  });
});
