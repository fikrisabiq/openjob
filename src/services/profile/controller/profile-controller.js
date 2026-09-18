
import ProfileRepositories from '../repositories/profile-repositories.js';
import { NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const getProfile = async (req, res, next) => {
  const { id:userId } = req.user;
  const profile = await ProfileRepositories.getProfile(userId);

  if (!profile) {
    return next(new NotFoundError('Profil tidak ditemukan'));
  }

  return response(res, 200, 'Profile sukses ditampilkan', profile);
};

export const getProfileApplications = async (req, res, next) => {
  const { id:userId } = req.user;

  const applications = await ProfileRepositories.getProfileApplications(userId);

  if (!applications) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi sukses ditampilkan', { applications });
};

export const getProfileBookmarks = async (req, res, next) => {
  const { id:userId } = req.user;

  const bookmarks = await ProfileRepositories.getProfileBookmarks(userId);

  if (!bookmarks) {
    return next(new NotFoundError('Bookmarks tidak ditemukan'));
  }

  return response(res, 200, 'Bookmarks sukses ditampilkan', { bookmarks });
};