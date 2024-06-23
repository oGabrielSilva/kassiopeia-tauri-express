import { Handler, NextFunction, Request, Response } from 'express';

export function adapter(handlerFn: Handler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await Promise.resolve(handlerFn(req, res, next));
    } catch (e) {
      return next(e);
    }
  };
}
