import { NotFound } from '@/exceptions/class/NotFound';
import { UserController } from '@/modules/user/controllers/UserController';
import express from 'express';
import { adapter } from './utilities/adapter';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 3145728 } });

//ping
router.get(
  '/ping',
  adapter((_, res) => res.json({ ping: Date.now() }))
);

//user
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

export default router;
