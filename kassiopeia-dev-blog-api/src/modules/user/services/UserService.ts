import { DBClient } from '@/db/DBClient';
import { UserEntity } from '../entities/UserEntity';
import { Forbidden } from '@/exceptions/class/Forbidden';

export class UserService {
  private static instance: UserService;
  public readonly db = DBClient.get();

  private constructor() {}

  public async getAuthenticated(session?: ILocalSession): Promise<UserEntity | null> {
    if (!session) throw new Forbidden();
    const user = await this.db.user.findUnique({ where: { email: session.subject } });

    if (user === null) return null;
    return UserEntity.from(user);
  }

  public async getAuthenticatedOrThrowForbidden(
    session: ILocalSession | undefined
  ): Promise<UserEntity> {
    if (!session) throw new Forbidden();
    const user = await this.db.user.findUnique({ where: { email: session.subject } });

    if (user === null) throw new Forbidden();
    return UserEntity.from(user);
  }

  public static get service() {
    if (!UserService.instance) UserService.instance = new UserService();
    return UserService.instance;
  }
}
