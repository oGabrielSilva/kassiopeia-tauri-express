import crypto from 'crypto';
import type { IPostPatch, IPostRequest } from '@/modules/post/types/IPost';
import { BadRequest } from '@/exceptions/class/BadRequest';
import { PostService } from '@/modules/post/services/PostService';
import { InternalServerError } from '@/exceptions/class/InternalServerError';
import { UserService } from '@/modules/user/services/UserService';
import { UserEntity } from '@/modules/user/entities/UserEntity';
import { StackEntity } from '@/modules/stack/entities/StackEntity';
import { PostEntity } from '@/modules/post/entities/PostEntity';
import { NotFound } from '@/exceptions/class/NotFound';
import { DBClient } from '@/db/DBClient';
import { Unauthorized } from '@/exceptions/class/Unauthorized';
import { isMetaDescriptionValid } from '@/validation/meta';
import { User } from '@prisma/client';
import { Conflict } from '@/exceptions/class/Conflict';

export class PostController {
  public static async get(req: IRequest<IPostRequest>, res: IResponse) {
    if (!req.params.slug) throw new NotFound();

    const post = await DBClient.get().post.findUnique({ where: { slug: req.params.slug } });
    if (!post) throw new NotFound();

    res.status(200).json(await PostEntity.from(post).toDTO());
  }

  public static async store(req: IRequest<IPostRequest>, res: IResponse) {
    if (!req.body) throw new BadRequest();

    if (PostService.service.isPayloadValid(req.body, res.locals.i18n!)) {
      const client = UserService.service.db;
      const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
      const editors = (
        await client.user.findMany({
          where: {
            email: { in: Array.isArray(req.body.editors) ? req.body.editors : [] },
          },
        })
      ).map((user) => UserEntity.from(user));
      const stacks = (
        await client.stack.findMany({
          where: { name: { in: req.body.stacks } },
        })
      ).map((st) => StackEntity.from(st));

      if (!editors.find((edt) => edt.email === user.id)) editors.unshift(user);

      const post = await client.post.create({
        data: {
          title: req.body.title,
          slug: req.body.title + encodeURI(crypto.randomUUID()).replace(/-/g, ''),
          description: req.body.description,
          metaDescription: req.body.metaDescription,
          keywords: PostService.service.filterAndNormalizeKeywords(req.body.keywords),
          font: req.body.font,
          lang: req.body.lang,
          stacksId: stacks.map((st) => st.id),
          editorsId: editors.map((edt) => edt.id),
          createdBy: user.id,
          htmlContent: '',
          updatedBy: user.id,
          views: 0,
          images: [],
        },
      });

      res.status(201).json(await PostEntity.from(post).toDTO());
    } else throw new InternalServerError();
  }

  public static async partialUpdate(req: IRequest<IPostPatch>, res: IResponse) {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') throw new NotFound();
    if (!req.body) throw new BadRequest();
    const client = DBClient.get();

    const post = await client.post.findUnique({
      where: { slug },
    });
    if (!post) throw new NotFound();

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
    if (!post.editorsId.includes(user.id)) throw new Unauthorized();

    const {
      title,
      slug: newSlug,
      description,
      font,
      keywords,
      lang,
      metaDescription,
      stacks: newStacks,
      stacks: newEditors,
    } = req.body;
    const payload = {} as IPostPatch;

    if (
      await PostService.service.canIUseThisTitle(title, PostEntity.from(post), res.locals.i18n!)
    ) {
      payload.title = title;
    }

    if (typeof description === 'string') payload.description = description;

    if (typeof newSlug === 'string' && newSlug !== slug) {
      const slugExists = await client.post.findUnique({ where: { slug: newSlug } });

      if (slugExists) throw new Conflict(res.locals.i18n?.slugAlreadyExists);
      payload.slug = newSlug;
    }

    if (PostService.service.isFontPayloadValid(font)) payload.font = font;

    if (Array.isArray(keywords))
      payload.keywords = PostService.service.filterAndNormalizeKeywords(keywords);

    if (PostService.service.isLangPayloadValid(lang)) payload.lang = lang;

    if (isMetaDescriptionValid(metaDescription)) payload.metaDescription = metaDescription;

    if (Array.isArray(newStacks) && newStacks.length > 0) {
      payload.stacks = post.stacksId ?? [];

      const stacks = await client.stack.findMany({ where: { name: { in: newStacks } } });
      stacks.forEach((stack) => {
        if (!post.stacksId.includes(stack.id)) payload.stacks.push(stack.id);
      });
    }

    let searchedEditors: User[] = [];

    if (Array.isArray(newEditors) && newEditors.length > 0) {
      payload.editors = post.editorsId;

      searchedEditors = await client.user.findMany({ where: { email: { in: newEditors } } });
      searchedEditors.forEach((edt) => {
        if (!post.editorsId.includes(edt.id)) payload.editors.push(edt.id);
      });
    }

    if (Object.keys(payload).length > 0) {
      const postUpdated = await client.post.update({ where: { id: post.id }, data: payload });
      res.status(200).json(await PostEntity.from(postUpdated).toDTO());
      return;
    }

    res.status(204).end();
  }
}
