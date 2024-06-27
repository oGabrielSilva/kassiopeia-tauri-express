import { Unauthorized } from '@/exceptions/class/Unauthorized';
import { $Enums } from '@prisma/client';

export async function onlyEditorMiddleware(req: IRequest, res: IResponse, next: INext) {
  const isEditor = res.locals.session?.authorities.includes($Enums.Role.EDITOR);

  if (!isEditor) throw new Unauthorized(res.locals.i18n?.userMustBeEditor);

  next();
}
