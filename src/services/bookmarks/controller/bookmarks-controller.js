
import BookmarksRepositories from '../repositories/bookmarks-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createBookmark = async (req, res, next) => {
  const { jobId } = req.params;
  const { id:userId } = req.user;

  const bookmark = await BookmarksRepositories.createBookmark({
    userId,
    jobId,
  });
  if (!bookmark) {
    return next(new InvariantError('Bookmark gagal ditambahkan'));
  }

  return response(res, 201, 'Bookmark berhasil ditambahkan', bookmark);
};

export const getBookmarks = async (req, res) => {
  const { id:userId } = req.user;

  const bookmarks = await BookmarksRepositories.getBookmarks(userId);
  return response(res, 200, 'Bookmark sukses ditampilkan', { bookmarks });
};

export const getBookmarksById = async (req, res, next) => {
  const { userId } = req.user;
  const { jobId } = req.params;

  const bookmark = await BookmarksRepositories.getBookmarksById(userId, jobId);

  if (!bookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Bookmark sukses ditampilkan', { bookmark });
};

export const deleteBookmarkById = async (req, res, next) => {
  const { id } = req.params;

  const deleteBookmark = await BookmarksRepositories.deleteBookmark(id);

  if (!deleteBookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Bookmark berhasil dihapus', deleteBookmark);
};