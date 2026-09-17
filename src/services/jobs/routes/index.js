import express from 'express';
import {
  createJob, getJobs, getJobById, getJobByCompanyId, getJobByCategoryId, editJobById, deleteJobById
} from '../controller/job-controller.js';
import { validate } from '../../../middlewares/validate.js';
import companiesPayloadSchema from '../../../services/companies/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/companies', authenticateToken, validate(companiesPayloadSchema), createJob);
router.get('/companies', getJobs);
router.get('/companies/:id', getJobById);
router.get('/companies/company/:companyId', getJobByCompanyId);
router.get('/companies/category/:categoryId', getJobByCategoryId);
router.put('/companies/:id', authenticateToken, validate(companiesPayloadSchema), editJobById);
router.delete('/companies/:id', authenticateToken, deleteJobById);

export default router;