import { InstanceTemplate } from './InstanceTemplate';

describe('Test Broadcasting InstanceTemplate', () => {
  it('should be a create InstanceTemplate isRight', () => {
    const instanceTemplate = new InstanceTemplate();

    expect(instanceTemplate).toBeInstanceOf(InstanceTemplate);
  });
});
