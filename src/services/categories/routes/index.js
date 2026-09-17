import express from 'express';
import {
  createCategories, getCategories, getCategoryById, editCategoryById, deleteCategoryById
} from '../controller/category-controller.js';
import { validate } from '../../../middlewares/validate.js';
import categoriesPayloadSchema from '../../../services/categories/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/categories', authenticateToken, validate(categoriesPayloadSchema), createCategories);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', authenticateToken, validate(categoriesPayloadSchema), editCategoryById);
router.delete('/categories/:id', authenticateToken, deleteCategoryById);

export default router;