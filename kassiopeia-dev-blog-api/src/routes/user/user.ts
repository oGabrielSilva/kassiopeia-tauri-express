import { NotFound } from '@/exceptions/class/NotFound';
import { UserController } from '@/modules/user/controllers/UserController';
import { adapter } from '@/routes/utilities/adapter';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import e from 'express';
import { upload } from '@/middlewares/multer';

export function requireUserRoutes() {
  const router = e.Router();

  router.get('/users/avatar/:id', adapter(UserController.getAvatar));

  router.post('/session', adapter(UserController.session));

  router.post('/user', adapter(UserController.store));

  router.post(
    '/user/check-email',
    adapter(authenticationMiddleware),
    adapter(UserController.createEmailCode)
  );

  router.patch(
    '/user/check-email',
    adapter(authenticationMiddleware),
    adapter(UserController.verifyEmailCode)
  );

  router.put(
    '/user/avatar',
    adapter(authenticationMiddleware),
    upload.single('avatar'),
    adapter(UserController.putAvatar)
  );

  router.patch('/user', adapter(authenticationMiddleware), adapter(UserController.partialUpdate));
  router.patch(
    '/user/credentials',
    adapter(authenticationMiddleware),
    adapter(UserController.patchEmailOrPassword)
  );

  router.delete(
    '/user/social/:id',
    adapter(authenticationMiddleware),
    adapter(UserController.deleteSocial)
  );

  router.use(
    adapter(() => {
      throw new NotFound('');
    })
  );

  return router;
}
