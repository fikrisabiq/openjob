import express from 'express';
import {
  createBookmark, getBookmarks, getBookmarksById, deleteBookmarkById
} from '../controller/bookmarks-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/applications', authenticateToken, createBookmark);
router.get('/applications', getBookmarks);
router.get('/applications/:id', getBookmarksById);
router.delete('/applications/:id', authenticateToken, deleteBookmarkById);

export default router;