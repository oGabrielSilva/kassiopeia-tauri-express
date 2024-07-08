import { upload } from '@/middlewares/multer';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import { onlyEditorMiddleware } from '@/modules/user/middlewares/editor';
import { adapter } from '@/routes/utilities/adapter';
import e from 'express';
import { PostController } from '../controllers/PostController';

const postRouter = e.Router();

postRouter.get('/post/media/:id', adapter(PostController.getMedia));
postRouter.get('/post/:slug', adapter(PostController.get));
postRouter.get('/post', adapter(PostController.getAll));

postRouter.post(
  '/post',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(PostController.store)
);

postRouter.patch(
  '/post/:slug/media',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(upload.single('mediaImage')),
  adapter(PostController.setMedia)
);

postRouter.patch(
  '/post/:slug',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(PostController.partialUpdate)
);

postRouter.delete(
  '/post/:slug',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(PostController.delete)
);

postRouter.get('/post/media/:id', adapter(PostController.getMedia));

export default postRouter;
