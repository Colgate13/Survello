import { features } from './Features';

describe('Test features', () => {
  it('should be a create features true', () => {
    expect(features).toBeInstanceOf(Set);
  });
});
