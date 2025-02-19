import { Router } from 'express';
import { requestController } from './request.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.service_provider),
  requestController.createRequest,
);
router.patch(
  '/approved/:id',
  auth(USER_ROLE.user),
  requestController.approvedRequest,
);
router.patch(
  '/canceled/:id',
  auth(USER_ROLE.user),
  requestController.canceledRequest,
);
router.patch(
  '/:id',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  requestController.updateRequest,
);
router.delete(
  '/:id',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  requestController.deleteRequest,
);
router.get(
  '/getMyRequests',
  auth(USER_ROLE.service_provider, USER_ROLE.user),
  requestController.getMyRequests,
);
router.get('/:id', requestController.getRequestById);
router.get('/', requestController.getAllRequest);

export const requestRoutes = router;
