export class Forbidden extends Error {
  public readonly name = 'FORBIDDEN';
  public readonly status = 403;
}
