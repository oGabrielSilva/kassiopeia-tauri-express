import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exceptionMiddleware } from '@/middlewares/exception';
import { propagateI18n } from '@/middlewares/i18n';
import globalRouter from '@/routes/global';
import userRouter from '@/modules/user/router/userRouter';
import stackRouter from '@/modules/stack/router/stackRouter';
import postRouter from '@/modules/post/router/postRouter';
import { adapter } from '@/routes/utilities/adapter';
import { NotFound } from '@/exceptions/class/NotFound';

export class Startup {
  private port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  private readonly app = express();

  private useExpressMiddlewares() {
    this.app.use(
      cors({
        origin: [...(process.env.BLOG_ORIGIN?.split(' ') || 'http://127.0.0.1')],
        allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
  }

  private defineRoutes() {
    this.app.use(globalRouter);
    this.app.use(userRouter);
    this.app.use(stackRouter);
    this.app.use(postRouter);

    this.app.use(
      adapter(() => {
        throw new NotFound('');
      })
    );
  }

  private configure() {
    this.useExpressMiddlewares();

    this.app.use(propagateI18n);

    this.defineRoutes();

    this.app.use(exceptionMiddleware);
  }

  private listen() {
    this.app.listen(this.port, () => console.log(`Application on http://127.0.0.1:${this.port}`));
  }

  public static run() {
    const app = new Startup();
    app.configure();
    app.listen();
  }
}

Startup.run();
