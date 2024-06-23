import type { ISocial, IUser, TAuthority } from '../types';

export class User implements IUser {
  public constructor(
    public name: string,
    public email: string,
    public bio: string,
    public social: ISocial[],
    public avatarURL: string,
    public isEmailChecked: boolean,
    public authorities: TAuthority[]
  ) {}

  public isEditor() {
    return this.authorities.includes('EDITOR');
  }

  public isHelper() {
    return this.authorities.includes('HELPER');
  }

  public isModerator() {
    return this.authorities.includes('MODERATOR');
  }

  public static from(o: any) {
    if (o instanceof User) return o;
    return new User(
      o.name ?? '',
      o.email ?? '',
      o.bio ?? '',
      o.social ?? [],
      o.avatarURL ?? '',
      o.isEmailChecked ?? false,
      o.authorities ?? []
    );
  }
}
