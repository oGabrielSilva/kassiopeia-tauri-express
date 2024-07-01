import { DBClient } from '@/db/DBClient';
import { StackEntity } from '@/modules/stack/entities/StackEntity';
import { UserEntity } from '@/modules/user/entities/UserEntity';
import type { Font, InnerLockedInfo, Lang, Post, Stack, User } from '@prisma/client';

export class PostEntity implements Post {
  public constructor(
    public id: string,
    public title: string,
    public slug: string,
    public htmlContent: string,
    public description: string,
    public metaDescription: string,
    public keywords: string[],
    public views: number,
    public stacksId: string[],
    public editorsId: string[],
    public images: string[],
    public isPublished: boolean,
    public publishedBy: string | null,
    public isLocked: boolean,
    public createdBy: string,
    public createdAt: Date,
    public updatedAt: Date,
    public updatedBy: string,
    public font: Font,
    public lang: Lang,
    public innerLockedInfo: InnerLockedInfo | null
  ) {}

  public async toDTO(
    authorAlreadySearched?: User,
    editorsAlreadySearched?: User[],
    stackAlreadySearched?: Stack[]
  ) {
    const {
      title,
      slug,
      htmlContent,
      description,
      metaDescription,
      keywords,
      views,
      font,
      stacksId,
      lang,
      editorsId,
      isPublished,
      isLocked,
      createdBy,
    } = this;

    const client = DBClient.get();

    const author = UserEntity.from(
      authorAlreadySearched
        ? authorAlreadySearched
        : (await client.user.findUnique({
            where: {
              id: createdBy,
            },
          }))!
    ).toDTO();

    const editors = (
      editorsAlreadySearched
        ? editorsAlreadySearched
        : await client.user.findMany({
            where: {
              id: { in: editorsId },
            },
          })
    ).map((entity) => (entity.email === author.email ? author : UserEntity.from(entity).toDTO()));

    const stacks = (
      stackAlreadySearched
        ? stackAlreadySearched
        : await client.stack.findMany({
            where: {
              id: {
                in: stacksId,
              },
            },
          })
    ).map((st) => StackEntity.from(st).toDTO());

    return {
      title,
      slug,
      htmlContent,
      description,
      metaDescription,
      keywords,
      views,
      font,
      lang,
      isPublished,
      isLocked,
      editors,
      author,
      stacks,
    };
  }

  public static from(o: Partial<PostEntity>) {
    if (o instanceof PostEntity) return o;

    return new PostEntity(
      o.id ?? '',
      o.title ?? '',
      o.slug ?? '',
      o.htmlContent ?? '',
      o.description ?? '',
      o.metaDescription ?? '',
      o.keywords ?? [],
      o.views ?? 0,
      o.stacksId ?? [],
      o.editorsId ?? [],
      o.images ?? [],
      o.isPublished ?? false,
      o.publishedBy ?? null,
      o.isLocked ?? false,
      o.createdBy ?? '',
      o.createdAt ?? new Date(),
      o.updatedAt ?? new Date(),
      o.updatedBy ?? '',
      o.font ?? ({} as Font),
      o.lang ?? ({} as Lang),
      o.innerLockedInfo ?? null
    );
  }
}
