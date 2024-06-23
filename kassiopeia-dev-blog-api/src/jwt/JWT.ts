import { UserEntity } from '@/modules/user/entities/UserEntity';
import { $Enums } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

interface ITokenPayload {
  authorities: $Enums.Role[];
  name: string;
  isEmailChecked: boolean;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
}

export class JWT {
  private static inst: JWT | null = null;

  private readonly tokenSecret = process.env.JWT_PRIVATE_KEY as string;
  private readonly issuer = process.env.JWT_ISSUER || 'Kassiopeia';
  private readonly audience = process.env.JWT_AUDIENCE || 'http://127.0.0.1';

  public async createToken(user: UserEntity) {
    return new Promise<string>((resolve) => {
      jsonwebtoken.sign(
        {
          authorities: user.getAuthorities(),
          name: user.name,
          isEmailChecked: user.isEmailChecked,
        },
        this.tokenSecret,
        {
          algorithm: 'HS256',
          expiresIn: user.authority === 'COMMON' ? '7d' : '4h',
          audience: this.audience,
          issuer: this.issuer,
          subject: user.email,
        },
        (err, token) => resolve(err ? '' : token ?? '')
      );
    });
  }

  public async testAndDecode(token: string) {
    return new Promise<ITokenPayload | null>((resolve) => {
      jsonwebtoken.verify(
        token,
        this.tokenSecret,
        {
          audience: this.audience,
          issuer: this.issuer,
          algorithms: ['HS256'],
        },
        (err, payload) => {
          resolve(err !== null ? null : (payload as ITokenPayload));
        }
      );
    });
  }

  public static get instance() {
    if (JWT.inst === null) {
      JWT.inst = new JWT();
    }
    return JWT.inst;
  }
}
