import { Forbidden } from '@/exceptions/class/Forbidden';
import { InternalServerError } from '@/exceptions/class/InternalServerError';
import { ExceptionDTO } from '@/exceptions/dto/ExceptionDTO';
import { ExceptionLogger } from '@/exceptions/handler/ExceptionLogger';
import { I18N_REQUEST_KEY } from '@/i18n/constants';
import { recoveryI18nStrings } from '@/i18n/handlers/recoveryI18nStrings';

export function exceptionMiddleware(err: unknown, req: IRequest, res: IResponse, next: INext) {
  if (!res.locals.i18n)
    res.locals.i18n = recoveryI18nStrings(
      req.headers[I18N_REQUEST_KEY] ?? req.cookies[I18N_REQUEST_KEY] ?? ''
    );

  if (err instanceof Forbidden) {
    ExceptionLogger.createLog(err.name, err.status, req, new Date(), err);
    res.status(err.status).end();
    next();
    return;
  }

  if (err instanceof InternalServerError) {
    ExceptionLogger.createLog(err.$message, err.status, req, err.timestamp, err);
    res
      .status(err.status)
      .json(
        new ExceptionDTO(
          err.$message || res.locals.i18n!.exceptions[err.status as 400],
          req.path,
          err.timestamp,
          err.status
        )
      );
  } else if (err instanceof SyntaxError) {
    const message = res.locals.i18n.exceptions.syntax;
    const timestamp = new Date();
    ExceptionLogger.createLog(message, 400, req, timestamp, err);

    res.status(400).json(new ExceptionDTO(message, req.path, timestamp, 400));
  } else {
    const timestamp = new Date();
    ExceptionLogger.createLog(
      (err as Error).message || 'Unexpected exception',
      500,
      req,
      timestamp,
      err as Error
    );
    res
      .status(500)
      .json(
        new ExceptionDTO(
          res.locals.i18n?.exceptions[500] ?? 'Unexpected exception',
          req.path,
          timestamp,
          500
        )
      );
  }

  next();
}
