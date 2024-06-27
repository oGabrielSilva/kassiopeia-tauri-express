import type ptBR from '@/i18n/class/pt-BR';
import type { $Enums } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

type I18n = typeof ptBR;

export declare global {
  interface IRequest<T = null> extends Request {
    body?: T;
  }

  interface ILocalSession {
    bearerAuth: {
      token: string;
      createdAt: Date;
      expiresAt: Date;
    };
    subject: string;
    authorities: $Enums.Role[];
    id: string;
  }

  interface IResponse extends Response {
    locals: {
      i18n?: IAppI18n;
      session?: ILocalSession;
    };
  }

  interface INext extends NextFunction {}

  interface IAppI18n extends I18n {}
}
