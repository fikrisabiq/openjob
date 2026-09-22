import express from 'express';
import {
  getProfile, getProfileApplications, getProfileBookmarks
} from './profile-controller.js';
import authenticateToken from '../../middlewares/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/profile/applications', authenticateToken, getProfileApplications);
router.get('/profile/bookmarks', authenticateToken, getProfileBookmarks);

export default router;