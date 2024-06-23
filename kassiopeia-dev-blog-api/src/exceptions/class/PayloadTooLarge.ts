import { InternalServerError } from '@/exceptions/class/InternalServerError';

export class PayloadTooLarge extends InternalServerError {
  public readonly name = 'PAYLOAD_TOO_LARGE';
  public readonly status = 413;
}
