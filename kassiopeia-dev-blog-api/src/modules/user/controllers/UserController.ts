import { DBClient } from '@/db/DBClient';
import { BadRequest } from '@/exceptions/class/BadRequest';
import { Conflict } from '@/exceptions/class/Conflict';
import { Forbidden } from '@/exceptions/class/Forbidden';
import { InternalServerError } from '@/exceptions/class/InternalServerError';
import { NotFound } from '@/exceptions/class/NotFound';
import { Unauthorized } from '@/exceptions/class/Unauthorized';
import { JWT } from '@/jwt/JWT';
import { EmailTemplate } from '@/modules/email/EmailTemplate';
import { EmailService } from '@/modules/email/services/EmailService';
import { PostEntity } from '@/modules/post/entities/PostEntity';
import { ImageUploadService } from '@/services/ImageUploadService';
import { IdGen } from '@/utilities/IdGen';
import { PasswordEncryptor } from '@/utilities/PasswordEncryptor';
import { Protocol } from '@/utilities/Protocol';
import { Kassiopeia } from '@/validation/kassiopeia';
import type { Role, SocialMedia, User } from '@prisma/client';
import { ValidationKassiopeiaTool } from 'kassiopeia-tools';
import stream from 'stream';
import { UserEntity } from '../entities/UserEntity';
import { UserService } from '../services/UserService';

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

  public static async get(req: IRequest, res: IResponse) {
    const { email } = req.params;
    if (!email || !ValidationKassiopeiaTool.get().isEmailValid(email)) throw new NotFound();

    const user = await DBClient.get().user.findUnique({ where: { email } });
    if (!user) throw new NotFound();

    res.status(200).json(UserEntity.from(user).toDTO());
  }

  public static async getAll(req: IRequest, res: IResponse) {
    let size = Number(req.query.size);
    let skip = Number(req.query.skip);
    const role =
      typeof req.query.role === 'string' ? (req.query.role.toLocaleUpperCase() as Role) : null;

    if (!size || Number.isNaN(size)) size = 25;
    if (!skip || Number.isNaN(skip)) skip = 0;
    try {
      const users = (
        await DBClient.get().user.findMany({
          skip,
          take: size,
          ...(role !== null
            ? {
                where: { authority: role, ...(role !== 'COMMON' ? { isEmailChecked: true } : {}) },
              }
            : {}),
        })
      ).map((user) => UserEntity.from(user).toDTO());

      res.status(200).json(users);
    } catch (error) {
      res.status(200).json([]);
    }
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

    const { bio, name } = req.body;
    const social = req.body.social as unknown as SocialMedia;

    if (!bio && !name && !social) throw new BadRequest(res.locals.i18n?.partialUpdateEmpty);

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
    const payload = {} as User;

    if (name && name !== user.name) {
      payload.name = name;
    }

    if (bio && bio !== user.bio) {
      payload.bio = bio;
    }

    if (social && typeof social.name === 'string' && typeof social.uri === 'string') {
      let exists = false;
      for (const key in user.social) {
        if (Object.prototype.hasOwnProperty.call(user.social, key)) {
          if (user.social[key].id === social.id) {
            user.social[key].name = social.name;
            user.social[key].uri = social.uri;
            exists = true;
            break;
          }
        }
      }

      payload.social = user.social;
      if (!exists) {
        payload.social.push(social);
      }
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

    const body = await ImageUploadService.service.require(UserController.AVATAR_PATH + '/' + id);
    if (!body) throw new NotFound(res.locals.i18n?.exceptions[404]);

    res.set('Content-Type', body.result.ContentType);

    stream.Readable.from([await body.object!.transformToByteArray()]).pipe(res);
  }

  public static async deleteSocial(req: IRequest, res: IResponse) {
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) throw new BadRequest(res.locals.i18n?.socialIdIsNumber);

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);

    const byId = user.social.find((socialLink) => socialLink.id === id);
    if (!byId) throw new NotFound(res.locals.i18n?.exceptions[404]);

    user.social = user.social.filter((socialLink) => socialLink.id !== id);

    await DBClient.get().user.update({
      where: {
        id: user.id,
      },
      data: {
        social: user.social,
      },
    });

    res.status(204).end();
  }

  public static async patchEmailOrPassword(req: IRequest<User>, res: IResponse) {
    if (!req.body) throw new BadRequest(res.locals.i18n?.bodyInvalid);
    const { email, password } = req.body;

    const { createdAt } = res.locals.session?.bearerAuth ?? {};

    if (!createdAt) throw new Forbidden();

    const expirationTime = new Date(createdAt.getTime());
    expirationTime.setMinutes(createdAt.getMinutes() + 30);

    if (expirationTime.getTime() < Date.now()) throw new Forbidden();

    const payload = {} as User;
    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);

    if (Kassiopeia.isEmailValid(email) && email !== user.email) {
      payload.email = email;
    }

    if (Kassiopeia.isPasswordValid(password)) {
      const isPasswordEquals = await PasswordEncryptor.compare(password, user.password);

      if (!isPasswordEquals) payload.password = await PasswordEncryptor.hash(password);
    }

    if (payload.email || payload.password) {
      await DBClient.get().user.update({
        where: { email: res.locals.session?.subject ?? '' },
        data: payload,
      });
    }

    res.status(204).end();
  }

  public static async verifyEmailCode(req: IRequest, res: IResponse) {
    if (!req.body) throw new BadRequest(res.locals.i18n?.bodyInvalid);

    const { token } = req.body as { token: string };
    if (typeof token !== 'string') throw new BadRequest(res.locals.i18n?.tokenInvalid);

    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);
    if (user.emailVerificationToken !== token)
      throw new Unauthorized(res.locals.i18n?.credentialsError);

    await UserService.service.db.user.update({
      where: { id: user.id },
      data: {
        isEmailChecked: true,
      },
    });

    res.status(201).end();
  }

  public static async createEmailCode(_: IRequest, res: IResponse) {
    const user = await UserService.service.getAuthenticatedOrThrowForbidden(res.locals.session);

    const code = await IdGen.nextId5();

    await UserService.service.db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: code,
      },
    });

    await EmailService.service.send(
      user.email,
      res.locals.i18n?.emailVerificationSubject.replace('#', code) ?? '',
      EmailTemplate.generateVerificationEmailToken(user, code)
    );

    res.status(201).end();
  }
  public static async getAllPosts(_: IRequest, res: IResponse) {
    const posts = (
      await DBClient.get().post.findMany({
        where: { createdBy: res.locals.session?.id ?? '' },
      })
    ).map(async (p) => await PostEntity.from(p).toDTO());

    res.status(200).json(await Promise.all(posts));
  }
}
