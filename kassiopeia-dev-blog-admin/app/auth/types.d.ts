export interface ISessionResponse {
  user: IUser;
  token: string;
}

export type TAuthority = 'COMMON' | 'EDITOR' | 'HELPER' | 'MODERATOR' | 'ADMIN' | 'ROOT';

export interface ISocial {
  name: string;
  uri: string;
}

export interface IUser {
  name: string;
  email: string;
  bio: string;
  social: ISocial[];
  avatarURL: string;
  isEmailChecked: boolean;
  authorities: TAuthority[];
}
