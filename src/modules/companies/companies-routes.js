import express from 'express';
import {
  createCompany, getCompanies, getCompanyById, editCompanyById, deleteCompanyById
} from './companies-controller.js';
import { validate } from '../../middlewares/validate.js';
import companiesPayloadSchema from './companies-schema.js';
import authenticateToken from '../../middlewares/auth.js';

const router = express.Router();

router.post('/companies', authenticateToken, validate(companiesPayloadSchema), createCompany);
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', authenticateToken, validate(companiesPayloadSchema), editCompanyById);
router.delete('/companies/:id', authenticateToken, deleteCompanyById);

export default router;