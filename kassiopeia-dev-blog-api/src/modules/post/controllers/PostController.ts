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
import { Conflict } from '@/exceptions/class/Conflict';

export class PostController {
  public static async get(req: IRequest<IPostRequest>, res: IResponse) {
    if (!req.params.slug) throw new NotFound();

    const post = await PostService.service.getAndIncrementView(req.params.slug);
    if (!post) throw new NotFound();

    res.status(200).json(await PostEntity.from(post).toDTO());
  }

  public static async getAll(req: IRequest<IPostRequest>, res: IResponse) {
    console.log(req.query);
    let size = Number(req.query.size);
    let skip = Number(req.query.skip);

    const stacksByQuery =
      Array.isArray(req.query.stack) || typeof req.query.stack === 'string'
        ? Array.from(Array.isArray(req.query.stack) ? [...req.query.stack] : [req.query.stack]).map(
            (st) => String(st)
          )
        : null;

    const keywords =
      Array.isArray(req.query.keywords) || typeof req.query.keywords === 'string'
        ? Array.from(
            Array.isArray(req.query.keywords) ? [...req.query.keywords] : [req.query.keywords]
          ).map((key) => String(key))
        : null;

    if (!size || Number.isNaN(size)) size = 25;
    if (!skip || Number.isNaN(skip)) skip = 0;
    const client = DBClient.get();

    const stacks =
      stacksByQuery !== null
        ? await client.stack.findMany({ where: { name: { in: stacksByQuery } } })
        : null;

    const posts = await client.post.findMany({
      skip,
      take: size,
      ...(stacks !== null || keywords !== null
        ? {
            where: {
              ...(stacks !== null
                ? {
                    stacksId: {
                      hasSome: stacks.map((st) => st.id),
                    },
                  }
                : {}),
              ...(keywords !== null
                ? {
                    keywords: { hasSome: keywords },
                  }
                : {}),
            },
          }
        : {}),
    });

    await PostService.service.incrementViews(
      posts.map((p, i) => {
        posts[i].views += 1;
        return p.slug;
      })
    );

    res
      .status(200)
      .json(
        await Promise.all(
          posts.map(async (p) => await PostEntity.from(p as Partial<PostEntity>).toDTO())
        )
      );
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
    if (!post.editorsId.includes(user.id) && post.createdBy !== user.id)
      throw new Unauthorized(res.locals.i18n?.userCantEditPost);

    const {
      title,
      slug: newSlug,
      description,
      font,
      keywords,
      lang,
      metaDescription,
      stacks: newStacks,
      editors: newEditors,
    } = req.body;
    const payload = {} as Partial<IPostPatch>;

    if (
      (await PostService.service.canIUseThisTitle(
        title,
        PostEntity.from(post),
        res.locals.i18n!
      )) &&
      title !== post.title
    ) {
      payload.title = title;
    }

    if (typeof description === 'string' && description !== post.description)
      payload.description = description;

    if (typeof newSlug === 'string' && newSlug !== slug) {
      const slugExists = await client.post.findUnique({ where: { slug: newSlug } });

      if (slugExists) throw new Conflict(res.locals.i18n?.slugAlreadyExists);
      payload.slug = newSlug;
    }

    if (
      PostService.service.isFontPayloadValid(font) &&
      (font.face !== post.font.face ||
        font.generic !== post.font.generic ||
        font.size !== post.font.size)
    )
      payload.font = font;

    if (Array.isArray(keywords))
      payload.keywords = PostService.service.filterAndNormalizeKeywords(keywords);

    if (
      PostService.service.isLangPayloadValid(lang) &&
      (post.lang.code !== lang.code || post.lang.label !== lang.label)
    )
      payload.lang = lang;

    if (isMetaDescriptionValid(metaDescription) && metaDescription !== post.metaDescription)
      payload.metaDescription = metaDescription;

    if (Array.isArray(newStacks)) {
      payload.stacks = [];

      const stacks = await client.stack.findMany({ where: { name: { in: newStacks } } });
      stacks.forEach((stack) => payload.stacks!.push(stack.id));

      const st = [...payload.stacks];
      delete payload.stacks;
      (payload as { [key: string]: string[] }).stacksId = st;
    }

    if (Array.isArray(newEditors)) {
      payload.editors = [];

      const searchedEditors = await client.user.findMany({ where: { email: { in: newEditors } } });
      searchedEditors.forEach((edt) => payload.editors!.push(edt.id));

      const edt = payload.editors;
      delete payload.editors;
      (payload as { [key: string]: string[] }).editorsId = edt;
    }

    if (Object.keys(payload).length > 0) {
      const postUpdated = await client.post.update({ where: { id: post.id }, data: payload });
      res.status(200).json(await PostEntity.from(postUpdated).toDTO());
      return;
    }

    res.status(204).end();
  }

  public static async delete(req: IRequest<IPostRequest>, res: IResponse) {
    if (!req.params.slug) throw new NotFound();

    const client = DBClient.get();
    const post = await client.post.delete({
      where: { slug: req.params.slug, createdBy: res.locals.session?.id ?? '' },
    });
    // const post = await client.post.delete({ where: { slug: req.params.slug } });
    console.log(post);

    res.status(204).end();
  }
}
