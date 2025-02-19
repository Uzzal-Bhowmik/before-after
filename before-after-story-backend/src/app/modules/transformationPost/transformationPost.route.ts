import { Router } from 'express';
import { transformationPostController } from './transformationPost.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.user),
  upload.fields([
    { name: 'beforeStory', maxCount: 1 },
    { name: 'afterStory', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseData(),
  transformationPostController.createTransformationPost,
);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  upload.fields([
    { name: 'beforeStory', maxCount: 1 },
    { name: 'afterStory', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseData(),
  transformationPostController.updateTransformationPost,
);
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  transformationPostController.deleteTransformationPost,
);
router.get(
  '/my-post',
  auth(USER_ROLE.user),
  transformationPostController.getMyTransformationPost,
);
router.get('/:id', transformationPostController.getTransformationPostById);
router.get('/', transformationPostController.getAllTransformationPost);

export const transformationPostRoutes = router;
