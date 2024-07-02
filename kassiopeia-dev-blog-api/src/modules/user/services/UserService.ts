import { DBClient } from '@/db/DBClient';
import { Forbidden } from '@/exceptions/class/Forbidden';
import { $Enums } from '@prisma/client';
import { UserEntity } from '../entities/UserEntity';

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

  public authoritiesBelow(authority: unknown): $Enums.Role[] {
    if (typeof authority === 'string') {
      if (authority === 'COMMON') return ['COMMON'];
      if (authority === 'EDITOR') return ['EDITOR', 'COMMON'];
      if (authority === 'HELPER') return ['HELPER', 'EDITOR', 'COMMON'];
      if (authority === 'MODERATOR') return ['MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
      if (authority === 'ADMIN') return ['ADMIN', 'MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
      if (authority === 'ROOT') return ['ROOT', 'ADMIN', 'MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
    }
    return [];
  }

  public static get service() {
    if (!UserService.instance) UserService.instance = new UserService();
    return UserService.instance;
  }
}
