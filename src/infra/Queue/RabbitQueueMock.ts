export class QueuMock {
  public channel: any;
  private static instance: QueuMock;

  private constructor() {
    this.channel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    };
  }

  static getInstance(): QueuMock {
    if (!QueuMock.instance) {
      QueuMock.instance = new QueuMock();
    }

    return QueuMock.instance;
  }
}
