import express from 'express';
import {join} from 'path';
import pkgDir from 'pkg-dir';

const indexRouter = express.Router();
export default indexRouter;

indexRouter.get('/*', async (req, res) => {
  res.sendFile(join(await pkgDir(__dirname) + '/client/build/index.html'));
});
