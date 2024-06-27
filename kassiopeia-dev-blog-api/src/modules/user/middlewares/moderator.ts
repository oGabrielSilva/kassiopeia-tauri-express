import { Unauthorized } from '@/exceptions/class/Unauthorized';
import { $Enums } from '@prisma/client';

export async function onlyModMiddleware(req: IRequest, res: IResponse, next: INext) {
  const isMod = res.locals.session?.authorities.includes($Enums.Role.MODERATOR);

  if (!isMod) throw new Unauthorized(res.locals.i18n?.userMustBeMod);

  next();
}
