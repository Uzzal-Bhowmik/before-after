import { Router } from 'express';
import { subcategoryController } from './subcategory.controller';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  subcategoryController.createSubcategory,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  subcategoryController.updateSubcategory,
);

router.delete('/:id', subcategoryController.deleteSubcategory);

router.get('/:id', subcategoryController.getSubcategoryById);
router.get('/', subcategoryController.getAllSubcategory);

export const subcategoryRoutes = router;
