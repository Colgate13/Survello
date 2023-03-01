import { queueConsumers, webServers } from './app';

describe('app', () => {
  it('Imports is rigth', () => {
    expect(queueConsumers).toBeDefined();
    expect(webServers).toBeDefined();
  });
});
