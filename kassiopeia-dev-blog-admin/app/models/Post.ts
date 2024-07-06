import { User } from '@app/auth/models/User'
import { Stack } from './Stack'

export interface IPost {
  title: string
  slug: string
  htmlContent: string
  description: string
  metaDescription: string
  keywords: string[]
  views: number
  font: IFont
  lang: ILang
  isPublished: boolean
  isLocked: boolean
  editors: User[]
  author: User
  stacks: Stack[]
}

export class Post implements IPost {
  public constructor(
    public title: string,
    public slug: string,
    public htmlContent: string,
    public description: string,
    public metaDescription: string,
    public keywords: string[],
    public views: number,
    public font: IFont,
    public lang: ILang,
    public isPublished: boolean,
    public isLocked: boolean,
    public editors: User[],
    public author: User,
    public stacks: Stack[],
  ) {}

  public static from(o: Partial<IPost>) {
    if (o instanceof Post) return o

    return new Post(
      o.title ?? '',
      o.slug ?? '',
      o.htmlContent ?? '',
      o.description ?? '',
      o.metaDescription ?? '',
      o.keywords ?? [],
      o.views ?? 0,
      o.font ?? { face: 'Lato', generic: 'sans-serif', size: 16 },
      o.lang ?? { code: 'pt-BR', label: 'Português (Brasil)' },
      o.isPublished ?? false,
      o.isLocked ?? false,
      o.editors ?? [],
      o.author ?? ({} as User),
      o.stacks ?? [],
    )
  }
}
