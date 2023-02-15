import { app } from './app';

describe('app', () => {
  it('should log Hello World', () => {
    const logSpy = jest.spyOn(console, 'log');
    app();
    expect(logSpy).toHaveBeenCalledWith('Hello World');
  });
});
