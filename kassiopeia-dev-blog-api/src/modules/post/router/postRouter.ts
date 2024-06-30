import { onlyEditorMiddleware } from '@/modules/user/middlewares/editor';
import { adapter } from '@/routes/utilities/adapter';
import e from 'express';
import { PostController } from '../controllers/PostController';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';

const postRouter = e.Router();

postRouter.get('/post/:slug', adapter(PostController.get));

postRouter.post(
  '/post',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(PostController.store)
);

postRouter.patch(
  '/post/:slug',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(PostController.partialUpdate)
);

export default postRouter;
