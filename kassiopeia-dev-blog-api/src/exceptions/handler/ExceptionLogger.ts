import fs from 'fs';
import { resolve } from 'path';

export class ExceptionLogger {
  private static readonly filePath = resolve(__dirname, '..', '..', '..', './log');

  public static async createLog(
    message: string,
    status: number,
    req: IRequest,
    timestamp: Date,
    err: Error
  ) {
    const log = `\n[${timestamp.toUTCString()}] [#ID]: ${
      (err.constructor && err.constructor.name) || 'unknown'
    } [#message]: ${message} [#status]: ${status} [#path]: ${
      req.path
    } [#method]: ${req.method.toLocaleUpperCase()} [#original]: ${err.message}`;
    console.log(log);

    try {
      await fs.promises.access(ExceptionLogger.filePath);
    } catch (error) {
      await fs.promises.writeFile(ExceptionLogger.filePath, '');
    }

    try {
      await fs.promises.appendFile(ExceptionLogger.filePath, log);
    } catch (error) {
      console.error('Erro ao escrever o log:', error);
      console.error(err);
      console.log('\n\n');
    }
  }
}
