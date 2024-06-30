import e from 'express';
import { adapter } from '@/routes/utilities/adapter';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import { StackController } from '@/modules/stack/controllers/StackController';
import { onlyEditorMiddleware } from '@/modules/user/middlewares/editor';
import { onlyModMiddleware } from '@/modules/user/middlewares/moderator';

const stackRouter = e.Router();

stackRouter.get('/stack', adapter(StackController.getAll));
stackRouter.get('/stack/:name', adapter(StackController.get));

stackRouter.post(
  '/stack',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(StackController.store)
);

stackRouter.patch(
  '/stack/:name',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(StackController.partialUpdate)
);
stackRouter.patch(
  '/stack/:name/unlock',
  adapter(authenticationMiddleware),
  adapter(onlyModMiddleware),
  adapter(StackController.unlock)
);

stackRouter.delete(
  '/stack/:name',
  adapter(authenticationMiddleware),
  adapter(onlyEditorMiddleware),
  adapter(StackController.lock)
);

export default stackRouter;
