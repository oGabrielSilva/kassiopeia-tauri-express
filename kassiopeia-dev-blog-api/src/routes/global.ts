import express from 'express';
import { adapter } from '@/routes/utilities/adapter';
import { authenticationMiddleware } from '@/modules/user/middlewares/authentication';
import { StackController } from '@/modules/stack/controllers/StackController';
import { onlyEditorMiddleware } from '@/modules/user/middlewares/editor';
import { onlyModMiddleware } from '@/modules/user/middlewares/moderator';

export function requireGlobalRoutes() {
  const router = express.Router();

  //ping
  router.get(
    '/ping',
    adapter((_, res) => res.json({ ping: Date.now() }))
  );

  //stacks
  router.get('/stack', adapter(StackController.getAll));
  router.get('/stack/:name', adapter(StackController.get));

  router.post(
    '/stack',
    adapter(authenticationMiddleware),
    adapter(onlyEditorMiddleware),
    adapter(StackController.store)
  );

  router.patch(
    '/stack/:name',
    adapter(authenticationMiddleware),
    adapter(onlyEditorMiddleware),
    adapter(StackController.partialUpdate)
  );
  router.patch(
    '/stack/:name/unlock',
    adapter(authenticationMiddleware),
    adapter(onlyModMiddleware),
    adapter(StackController.unlock)
  );

  router.delete(
    '/stack/:name',
    adapter(authenticationMiddleware),
    adapter(onlyEditorMiddleware),
    adapter(StackController.lock)
  );

  return router;
}
