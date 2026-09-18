import express from 'express';
import {
  createBookmark, getBookmarks, getBookmarksById, deleteBookmarkById
} from '../controller/bookmarks-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/jobs/:jobId/bookmark', authenticateToken, createBookmark);
router.get('/bookmarks', authenticateToken, getBookmarks);
router.get('/jobs/:jobId/bookmark/:id', authenticateToken, getBookmarksById);
router.delete('/jobs/:jobId/bookmark', authenticateToken, deleteBookmarkById);

export default router;