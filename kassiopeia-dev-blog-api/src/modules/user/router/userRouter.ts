import { UserController } from '@/modules/user/controllers/UserController';
import { adapter } from '@/routes/utilities/adapter';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import e from 'express';
import { upload } from '@/middlewares/multer';

const userRouter = e.Router();

userRouter.get('/users/avatar/:id', adapter(UserController.getAvatar));

userRouter.post('/session', adapter(UserController.session));

userRouter.post('/user', adapter(UserController.store));

userRouter.post(
  '/user/check-email',
  adapter(authenticationMiddleware),
  adapter(UserController.createEmailCode)
);

userRouter.patch(
  '/user/check-email',
  adapter(authenticationMiddleware),
  adapter(UserController.verifyEmailCode)
);

userRouter.put(
  '/user/avatar',
  adapter(authenticationMiddleware),
  upload.single('avatar'),
  adapter(UserController.putAvatar)
);

userRouter.patch('/user', adapter(authenticationMiddleware), adapter(UserController.partialUpdate));
userRouter.patch(
  '/user/credentials',
  adapter(authenticationMiddleware),
  adapter(UserController.patchEmailOrPassword)
);

userRouter.delete(
  '/user/social/:id',
  adapter(authenticationMiddleware),
  adapter(UserController.deleteSocial)
);

export default userRouter;
