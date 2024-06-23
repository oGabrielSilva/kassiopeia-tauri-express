import { Forbidden } from '@/exceptions/class/Forbidden';
import { JWT } from '@/jwt/JWT';

const jwt = JWT.instance;

export async function authenticationMiddleware(req: IRequest, res: IResponse, next: INext) {
  const header = req.headers.authorization;
  if (!header) throw new Forbidden();

  const token = header.replace('Bearer ', '');
  const payload = await jwt.testAndDecode(token);

  if (payload === null) throw new Forbidden();

  res.locals.session = { authorities: payload.authorities, subject: payload.sub };
  next();
}
