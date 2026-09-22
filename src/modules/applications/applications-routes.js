import express from 'express';
import {
  createApp, getApps, getAppById, getAppByJobId, getAppByUserId, editAppById, deleteAppById
} from './applications-controller.js';
import { validate } from '../../middlewares/validate.js';
import { PostApplicationPayloadSchema, PutApplicationStatusPayloadSchema } from './applications-schema.js';
import authenticateToken from '../../middlewares/auth.js';

const router = express.Router();

router.post('/applications', authenticateToken, validate(PostApplicationPayloadSchema), createApp);
router.get('/applications', authenticateToken, getApps);

router.get('/applications/user/:userId', authenticateToken, getAppByUserId);
router.get('/applications/job/:JobId', authenticateToken, getAppByJobId);

router.get('/applications/:id', authenticateToken, getAppById);

router.put('/applications/:id', authenticateToken, validate(PutApplicationStatusPayloadSchema), editAppById);
router.delete('/applications/:id', authenticateToken, deleteAppById);

export default router;