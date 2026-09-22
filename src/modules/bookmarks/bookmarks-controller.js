import BookmarksRepositories from './bookmarks-repositories.js';
import { InvariantError, NotFoundError } from '../../exceptions/index.js';
import response from '../../utils/response.js';

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

  const { bookmarks, source } = await BookmarksRepositories.getBookmarks(userId);
  res.setHeader('X-Data-Source', source);
  return response(res, 200, 'Bookmark sukses ditampilkan', { bookmarks });
};

export const getBookmarksById = async (req, res, next) => {
  const { id, jobId } = req.params;

  const { bookmark, source } = await BookmarksRepositories.getBookmarksById(id, jobId);

  if (!bookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);


  return response(res, 200, 'Bookmark sukses ditampilkan', bookmark);
};

export const deleteBookmarkById = async (req, res, next) => {
  const { jobId } = req.params;

  const deleteBookmark = await BookmarksRepositories.deleteBookmark(jobId);

  if (!deleteBookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Bookmark berhasil dihapus', deleteBookmark);
};