import type { $Enums, User as PrismaUser, SocialMedia } from '@prisma/client';

export class UserEntity implements PrismaUser {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public bio: string,
    public avatarURL: string,
    public social: SocialMedia[] = [],
    public avatarOriginalURL: string,
    public password: string,
    public isLocked: boolean,
    public isEmailChecked: boolean,
    public emailVerificationToken: string | null = null,
    public authority: $Enums.Role,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public getAuthorities(): $Enums.Role[] {
    if (this.authority === 'COMMON') return ['COMMON'];
    if (this.authority === 'EDITOR') return ['EDITOR', 'COMMON'];
    if (this.authority === 'HELPER') return ['HELPER', 'EDITOR', 'COMMON'];
    if (this.authority === 'MODERATOR') return ['MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
    if (this.authority === 'ADMIN') return ['ADMIN', 'MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
    return ['ROOT', 'ADMIN', 'MODERATOR', 'HELPER', 'EDITOR', 'COMMON'];
  }

  public isEditor() {
    return this.getAuthorities().includes('EDITOR');
  }

  public isHelper() {
    return this.getAuthorities().includes('HELPER');
  }

  public isModerator() {
    return this.getAuthorities().includes('MODERATOR');
  }

  public toDTO() {
    const { avatarURL, bio, email, isEmailChecked, name, social } = this;
    return {
      name,
      email,
      bio,
      social,
      avatarURL,
      isEmailChecked,
      authorities: this.getAuthorities(),
    };
  }

  public static from(o: Partial<UserEntity>) {
    if (o instanceof UserEntity) return o;
    return new UserEntity(
      o.id ?? '',
      o.email ?? '',
      o.name ?? '',
      o.bio ?? '',
      o.avatarURL ?? '',
      o.social ?? [],
      o.avatarOriginalURL ?? '',
      o.password ?? '',
      o.isLocked ?? false,
      o.isEmailChecked ?? false,
      o.emailVerificationToken ?? '',
      o.authority ?? 'COMMON',
      o.createdAt!,
      o.updatedAt!
    );
  }

  public static cleaned() {
    const now = new Date();
    return new UserEntity('', '', '', '', '', [], '', '', false, false, null, 'COMMON', now, now);
  }
}
