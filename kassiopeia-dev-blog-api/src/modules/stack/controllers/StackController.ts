import { DBClient } from '@/db/DBClient';
import { BadRequest } from '@/exceptions/class/BadRequest';
import { Conflict } from '@/exceptions/class/Conflict';
import { Stack } from '@prisma/client';
import { ValidationKassiopeiaTool } from 'kassiopeia-tools';
import { StackEntity } from '@/modules/stack/entities/StackEntity';
import { NotFound } from '@/exceptions/class/NotFound';

export class StackController {
  public static async get(req: IRequest, res: IResponse) {
    const { name } = req.params;

    if (!name) throw new BadRequest(res.locals.i18n?.nameIsParamRequired);

    const stack = await DBClient.get().stack.findUnique({ where: { name } });
    if (!stack) throw new NotFound();

    res.status(200).json(StackEntity.from(stack).toDTO());
  }

  public static async getAll(req: IRequest, res: IResponse) {
    const size = req.query.size ? Number(req.query.size) : null;
    let skip = req.query.skip ? Number(req.query.skip) : 0;

    if (Number.isNaN(skip) || skip < 0) skip = 0;

    const client = DBClient.get();

    let stacks: Stack[];

    if (size && !Number.isNaN(size)) {
      stacks = await client.stack.findMany({ where: { isLocked: false }, take: size, skip });
    } else {
      stacks = await client.stack.findMany({ where: { isLocked: false } });
    }

    res.status(200).json(stacks.map((stack) => StackEntity.from(stack).toDTO()));
  }

  public static async store(req: IRequest<Stack>, res: IResponse) {
    if (!req.body) throw new BadRequest(res.locals.i18n?.bodyInvalid);

    const { description, metaDescription, name } = req.body;

    if (!ValidationKassiopeiaTool.get().isNameValid(name)) {
      throw new BadRequest(res.locals.i18n?.nameInvalid);
    }

    if (!metaDescription || metaDescription.length > 160 || metaDescription.length < 50) {
      throw new BadRequest(res.locals.i18n?.metaDescriptionInvalid);
    }

    const byName = await DBClient.get().stack.findUnique({
      where: { name },
    });

    if (byName) throw new Conflict(res.locals.i18n?.stackAlreadyExists);

    const stack = await DBClient.get().stack.create({
      data: {
        name,
        metaDescription,
        description,
        createdBy: res.locals.session!.id,
        updatedBy: res.locals.session!.id,
      },
    });

    res.status(201).json(StackEntity.from(stack).toDTO());
  }

  public static async partialUpdate(req: IRequest<Stack>, res: IResponse) {
    const { name: originalName } = req.params;

    if (!originalName) throw new BadRequest(res.locals.i18n?.nameIsParamRequired);

    if (!req.body) throw new BadRequest(res.locals.i18n?.bodyInvalid);

    const { name, description, metaDescription } = req.body;
    const payload = {} as Stack;

    if (!!name && ValidationKassiopeiaTool.get().isNameValid(name)) {
      payload.name = name;
    }

    if (description) {
      payload.description = description;
    }

    if (!!metaDescription && metaDescription.length >= 50 && metaDescription.length <= 160) {
      payload.metaDescription = metaDescription;
    }

    if (Object.keys(payload).length > 0) {
      const client = DBClient.get();

      const stack = await client.stack.findUnique({
        where: {
          name: originalName,
        },
      });

      if (!stack) throw new NotFound(res.locals.i18n?.exceptions[404]);

      payload.updatedBy = res.locals.session!.id;

      await client.stack.update({
        where: { id: stack.id },
        data: payload,
      });
    }

    res.status(204).end();
  }

  public static async lock(req: IRequest<Stack>, res: IResponse) {
    const { name } = req.params;

    if (!name) throw new BadRequest(res.locals.i18n?.nameIsParamRequired);

    const client = DBClient.get();
    const stack = await client.stack.findUnique({ where: { name } });
    if (!stack) throw new NotFound();

    await client.stack.update({
      where: { name },
      data: {
        isLocked: true,
      },
    });
    res.status(204).end();
  }

  public static async unlock(req: IRequest<Stack>, res: IResponse) {
    const { name } = req.params;

    if (!name) throw new BadRequest(res.locals.i18n?.nameIsParamRequired);

    const client = DBClient.get();
    const stack = await client.stack.findUnique({ where: { name } });
    if (!stack) throw new NotFound();

    await client.stack.update({
      where: { name },
      data: {
        isLocked: false,
      },
    });
    res.status(204).end();
  }
}
