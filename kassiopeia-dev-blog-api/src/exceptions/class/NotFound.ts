import { InternalServerError } from '@/exceptions/class/InternalServerError';

export class NotFound extends InternalServerError {
  public readonly name = 'NOT_FOUND';
  public readonly status = 404;
}
