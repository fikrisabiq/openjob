import { Router } from 'express';
import { uploadDocument, getDocuments, getDocumentById, deleteDocumentById } from './documents-controller.js';
import authenticateToken from '../../middlewares/auth.js';
import { upload } from './documents-config.js';

const router = Router();

router.post('/documents', authenticateToken, upload.single('document'), uploadDocument);
router.get('/documents', getDocuments);
router.get('/documents/:id', getDocumentById);
router.delete('/documents/:id', authenticateToken, deleteDocumentById);

export default router;