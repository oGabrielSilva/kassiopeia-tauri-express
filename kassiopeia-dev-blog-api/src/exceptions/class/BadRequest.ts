import { InternalServerError } from './InternalServerError';

export class BadRequest extends InternalServerError {
  public readonly name = 'BAD_REQUEST';
  public readonly status = 400;
}
