import { BadRequest } from '@/exceptions/class/BadRequest';
import type { IPostRequest } from '../types/IPost';
import { isMetaDescriptionValid } from '@/validation/meta';
import { PostEntity } from '../entities/PostEntity';
import { DBClient } from '@/db/DBClient';
import { Conflict } from '@/exceptions/class/Conflict';
import type { Font, Lang } from '@prisma/client';

export class PostService {
  private static instance: PostService;

  public isFontPayloadValid(font: Partial<Font>) {
    return (
      font &&
      typeof font.face === 'string' &&
      typeof font.generic === 'string' &&
      typeof font.size === 'number' &&
      !Number.isNaN(font.size)
    );
  }

  public isLangPayloadValid(lang: Partial<Lang>) {
    return lang && typeof lang.code === 'string' && typeof lang.label === 'string';
  }

  public filterAndNormalizeKeywords(keywords: string[]) {
    return keywords
      .filter((k) => !['object', 'function', 'undefined', 'symbol'].includes(typeof k))
      .map((k) => (typeof k === 'string' ? k : String(k)));
  }

  public isPayloadValid(payload: IPostRequest, i18n: IAppI18n) {
    if (typeof payload.title !== 'string') throw new BadRequest(i18n?.postTitleInvalid);

    if (typeof payload.description !== 'string') throw new BadRequest(i18n?.postDescriptionInvalid);

    if (!isMetaDescriptionValid(payload.metaDescription))
      throw new BadRequest(i18n?.metaDescriptionInvalid);

    if (!payload.keywords || !Array.isArray(payload.keywords))
      throw new BadRequest(i18n?.keywordsRequired);

    if (!this.isFontPayloadValid(payload.font)) throw new BadRequest(i18n?.fontRequired);

    if (!Array.isArray(payload.stacks)) throw new BadRequest(i18n?.stacksRequired);

    if (!this.isLangPayloadValid(payload.lang)) throw new BadRequest(i18n.langRequired);

    return true;
  }

  public async canIUseThisTitle(title: string, post: PostEntity, i18n: IAppI18n) {
    if (typeof title !== 'string') return false;
    if (title === post.title) return false;
    const postByTitle = await DBClient.get().post.findFirst({
      where: { title },
    });

    if (postByTitle) throw new Conflict(i18n.postTitleConflict);
    return true;
  }

  public static get service() {
    if (!PostService.instance) PostService.instance = new PostService();
    return PostService.instance;
  }
}
