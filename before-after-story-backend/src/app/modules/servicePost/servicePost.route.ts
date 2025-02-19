import { Router } from 'express';
import { servicePostController } from './servicePost.controller';
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
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  servicePostController.createServicePost,
);

router.patch(
  '/not-interested/:id',
  auth(USER_ROLE.service_provider),
  servicePostController.notInterested,
);
router.patch(
  '/completed/:id',
  auth(USER_ROLE.user),
  servicePostController.completedPost,
);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  servicePostController.updateServicePost,
);
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  servicePostController.deleteServicePost,
);
router.get(
  '/my-service-post',
  auth(USER_ROLE.user),
  servicePostController.getMyServicePost,
);
router.get('/:id', servicePostController.getServicePostById);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.service_provider),
  servicePostController.getAllServicePost,
);

export const servicePostRoutes = router;
