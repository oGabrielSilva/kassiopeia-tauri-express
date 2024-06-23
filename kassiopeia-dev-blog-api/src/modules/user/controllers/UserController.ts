import type { User } from '@prisma/client';
import { DBClient } from '@/db/DBClient';
import { BadRequest } from '@/exceptions/class/BadRequest';
import { Conflict } from '@/exceptions/class/Conflict';
import { Kassiopeia } from '@/validation/kassiopeia';
import { UserEntity } from '../entities/UserEntity';
import { PasswordEncryptor } from '@/utilities/PasswordEncryptor';
import { JWT } from '@/jwt/JWT';
import { NotFound } from '@/exceptions/class/NotFound';
import { Unauthorized } from '@/exceptions/class/Unauthorized';
import { UserService } from '../services/UserService';
import { ImageUploadService } from '@/services/ImageUploadService';
import { InternalServerError } from '@/exceptions/class/InternalServerError';
import stream from 'stream';
import { Protocol } from '@/utilities/Protocol';

export class UserController {
  public static get AVATAR_PATH() {
    return 'avatar';
  }

  private static validateAndRequireAuthPayload(
    payload: User | undefined,
    testPassword = true,
    i18n: IAppI18n
  ) {
    if (!payload) throw new BadRequest(i18n?.bodyInvalid);
    const { email, password } = payload;
    if (!password || typeof password !== 'string') throw new BadRequest(i18n?.passwordUndefined);

    if (!Kassiopeia.isEmailValid(email)) throw new BadRequest(i18n!.emailInvalid);
    if (testPassword && !Kassiopeia.isPasswordValid(password))
      throw new BadRequest(i18n!.passwordInvalid);

    return { email, password };
  }

  public static async store(req: IRequest<User>, res: IResponse) {
    const { email, password } = UserController.validateAndRequireAuthPayload(
      req.body,
      true,
      res.locals.i18n!
    );
    const client = DBClient.get();

    const userByEmail = await client.user.findUnique({ where: { email } });
    if (userByEmail !== null) throw new Conflict(res.locals.i18n?.userAlreadyExists);
    let user = UserEntity.cleaned();
    user.email = email;
    user.name = email.split('@')[0];
    user.password = await PasswordEncryptor.hash(password);

    delete (user as Partial<User>).id;
    user = UserEntity.from(await client.user.create({ data: user }));
    const token = await JWT.instance.createToken(user);
    res.status(201).json({ user: user.toDTO(), token }).end();
  }

  public static async session(req: IRequest<User>, res: IResponse) {
    const { email, password } = UserController.validateAndRequireAuthPayload(
      req.body,
      false,
      res.locals.i18n!
    );
    const client = DBClient.get();
    const user = await client.user.findUnique({ where: { email } });
    if (user === null) throw new NotFound(res.locals.i18n?.userNotFound);

    const passwordMatches = await PasswordEncryptor.compare(password, user.password);
    if (!passwordMatches) throw new Unauthorized(res.locals.i18n?.credentialsError);

    const entity = UserEntity.from(user);
    const token = await JWT.instance.createToken(entity);

    res.json({ user: entity.toDTO(), token }).status(200).end();
  }

  public static async partialUpdate(req: IRequest<User>, res: IResponse) {
    if (!req.body) throw new BadRequest(res.locals.i18n?.bodyInvalid);
    const { bio, name, social } = req.body;
    if (!bio && !name && !social) throw new BadRequest(res.locals.i18n?.partialUpdateEmpty);

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
    const payload = {} as User;

    if (name && name !== user.name) {
      payload.name = name;
    }

    if (bio && bio !== user.bio) {
      payload.bio = bio;
    }

    if (social && Array.isArray(social)) {
      payload.social = [];
      social.forEach((item) => {
        const exists = user.social.find((s) => s.name === item.name);
        if (!exists) payload.social.push(item);
      });

      if (payload.social.length === 0) delete (payload as unknown as { social?: [] }).social;
    }

    const data = await UserService.service.db.user.update({
      where: { id: user.id },
      data: payload,
    });

    const entity = UserEntity.from(data);
    const token = await JWT.instance.createToken(entity);
    res.status(200).json({ user: entity.toDTO(), token });
  }

  public static async putAvatar(req: IRequest, res: IResponse) {
    const file = req.file;

    if (!file) throw new BadRequest(res.locals.i18n?.bodyInvalid);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype))
      throw new BadRequest(res.locals.i18n?.avatarMimetype);

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
    const result = await ImageUploadService.service.uploadBuffer(
      user,
      user.id,
      UserController.AVATAR_PATH,
      file
    );

    if (!result) throw new InternalServerError(res.locals.i18n?.uploadBufferInternalError);
    const { privateURL } = result;

    const publicURL = Protocol.serverURI(req).concat(
      '/users/avatar/',
      user.id,
      '?serial=',
      Date.now().toString()
    );

    await DBClient.get().user.update({
      where: { id: user.id },
      data: {
        avatarURL: publicURL,
        avatarOriginalURL: privateURL,
      },
    });

    res.status(200).json({ url: publicURL });
  }

  public static async getAvatar(req: IRequest, res: IResponse) {
    const { id } = req.params;

    console.log({ id });

    const body = await ImageUploadService.service.require(UserController.AVATAR_PATH + '/' + id);
    if (!body) throw new NotFound(res.locals.i18n?.exceptions[404]);

    res.set('Content-Type', body.result.ContentType);

    stream.Readable.from([await body.object!.transformToByteArray()]).pipe(res);
  }
}
