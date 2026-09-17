import express from 'express';
import {
  createApp, getApps, getAppById, getAppByCompanyId, getAppByUserId, editAppById, deleteAppById
} from '../controller/applications-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { PostApplicationPayloadSchema, PutApplicationStatusPayloadSchema } from '../../../services/applications/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/applications', authenticateToken, validate(PostApplicationPayloadSchema), createApp);
router.get('/applications', getApps);
router.get('/applications/:id', getAppById);
router.get('/applications/users/:userId', getAppByUserId);
router.get('/applications/company/:companyId', getAppByCompanyId);
router.put('/applications/:id', authenticateToken, validate(PutApplicationStatusPayloadSchema), editAppById);
router.delete('/applications/:id', authenticateToken, deleteAppById);

export default router;