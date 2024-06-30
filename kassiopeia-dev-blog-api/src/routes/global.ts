import express from 'express';
import { adapter } from '@/routes/utilities/adapter';

const globalRouter = express.Router();

//ping
globalRouter.get(
  '/ping',
  adapter((_, res) => res.json({ ping: Date.now() }))
);

export default globalRouter;
