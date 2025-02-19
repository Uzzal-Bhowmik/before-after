import { Router } from 'express';
import { activityController } from './activity.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.service_provider),
  upload.fields([
    { name: 'beforeStory', maxCount: 1 },
    { name: 'afterStory', maxCount: 1 },
  ]),
  parseData(),
  activityController.createActivity,
);
router.patch(
  '/:id',
  auth(USER_ROLE.service_provider),
  upload.fields([
    { name: 'beforeStory', maxCount: 1 },
    { name: 'afterStory', maxCount: 1 },
  ]),
  parseData(),
  activityController.updateActivity,
);
router.delete(
  '/:id',
  auth(USER_ROLE.service_provider),
  activityController.deleteActivity,
);

router.get(
  '/my-activity',
  auth(USER_ROLE.service_provider),
  activityController.getMyActivity,
);
router.get('/:id', activityController.getActivityById);
router.get('/', activityController.getAllActivity);

export const activityRoutes = router;
