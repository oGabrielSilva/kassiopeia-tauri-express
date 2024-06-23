export class InternalServerError extends Error {
  public readonly timestamp = new Date();
  public readonly name: string = 'INTERNAL_SERVER_ERROR';
  public readonly status: number = 500;

  constructor(public readonly $message: string = '') {
    super($message);
  }
}
