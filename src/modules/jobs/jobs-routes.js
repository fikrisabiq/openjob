import express from 'express';
import {
  createJob, getJobs, getJobById, getJobByCompanyId, getJobByCategoryId, editJobById, deleteJobById
} from './jobs-controller.js';
import { validate } from '../../middlewares/validate.js';
import JobPayloadSchema from './jobs-schema.js';
import authenticateToken from '../../middlewares/auth.js';

const router = express.Router();

router.post('/jobs', authenticateToken, validate(JobPayloadSchema), createJob);
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.get('/jobs/company/:companyId', getJobByCompanyId);
router.get('/jobs/category/:categoryId', getJobByCategoryId);
router.put('/jobs/:id', authenticateToken, validate(JobPayloadSchema), editJobById);
router.delete('/jobs/:id', authenticateToken, deleteJobById);

export default router;