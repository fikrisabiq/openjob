import express from 'express';
import {
  createCompany, getCompanies, getCompanyById, editCompanyById, deleteCompanyById
} from '../controller/company-controller.js';
import { validate } from '../../../middlewares/validate.js';
import companiesPayloadSchema from '../../../services/companies/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/companies', authenticateToken, validate(companiesPayloadSchema), createCompany);
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', authenticateToken, validate(companiesPayloadSchema), editCompanyById);
router.delete('/companies/:id', authenticateToken, deleteCompanyById);

export default router;