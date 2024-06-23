import { I18N_REQUEST_KEY } from '@/i18n/constants';
import { recoveryI18nStrings } from '@/i18n/handlers/recoveryI18nStrings';

export function propagateI18n(req: IRequest, res: IResponse, next: INext) {
  const i18nCode = req.headers[I18N_REQUEST_KEY] ?? req.cookies[I18N_REQUEST_KEY] ?? '';

  res.locals.i18n = recoveryI18nStrings(i18nCode || '');

  next();
}
