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
router.post('/session', adapter(UserController.session));
router.post('/user', adapter(UserController.store));
router.put(
  '/user/avatar',
  adapter(authenticationMiddleware),
  upload.single('avatar'),
  adapter(UserController.putAvatar)
);
router.patch('/user', adapter(authenticationMiddleware), adapter(UserController.partialUpdate));
router.get('/users/avatar/:id', adapter(UserController.getAvatar));

router.use(
  adapter(() => {
    throw new NotFound('');
  })
);

export default router;
