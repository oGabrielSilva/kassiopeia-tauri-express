import { InternalServerError } from '@/exceptions/class/InternalServerError';

export class Conflict extends InternalServerError {
  public readonly name = 'CONFLICT';
  public readonly status = 409;
}
