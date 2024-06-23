import { InternalServerError } from '@/exceptions/class/InternalServerError';

export class Unauthorized extends InternalServerError {
  public readonly name = 'UNAUTHORIZED';
  public readonly status = 401;
}
