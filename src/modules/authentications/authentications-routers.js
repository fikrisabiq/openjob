import { Router } from 'express';
import { login, refreshToken, logout } from './authentications-controller.js';
import { validate } from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from './authentications-schema.js';

const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(deleteAuthenticationPayloadSchema), logout);

export default router;