import { Router } from 'express';
import { commentsController } from './comments.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  commentsController.createComments,
);
router.patch(
  '/:id',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  commentsController.updateComments,
);
router.delete(
  '/:id',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  commentsController.deleteComments,
);
router.get('/:id', commentsController.getCommentsById);
router.get('/', commentsController.getAllComments);

export const commentsRoutes = router;
