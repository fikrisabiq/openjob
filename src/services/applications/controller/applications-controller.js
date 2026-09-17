/* eslint-disable camelcase */
import AppsRepositories from '../repositories/applications-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createApp = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;
  const app = await AppsRepositories.createApp({
    user_id,
    job_id,
    status
  });
  if (!app) {
    return next(new InvariantError('Aplikasi gagal ditambahkan'));
  }

  return response(res, 201, 'Aplikasi berhasil ditambahkan', app);
};

export const getApps = async (req, res) => {
  const apps = await AppsRepositories.getApps();
  return response(res, 200, 'Aplikasi sukses ditampilkan', { apps });
};

export const getAppByUserId = async (req, res, next) => {
  const { userId } = req.params;

  const app = await AppsRepositories.getAppByUserId(userId);

  if (!app) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi sukses ditampilkan', { app });
};

export const getAppByCompanyId = async (req, res, next) => {
  const { CompanyId } = req.params;

  const app = await AppsRepositories.getAppByCompanyId(CompanyId);

  if (!app) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi sukses ditampilkan', { app });
};

export const getAppById = async (req, res, next) => {
  const { id } = req.params;

  const app = await AppsRepositories.getAppById(id);

  if (!app) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi sukses ditampilkan', { app });
};

export const editAppById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id, job_id, status } = req.validated;
  const app = await AppsRepositories.editApp({
    id,
    user_id,
    job_id,
    status
  });

  if (!app) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi berhasil diperbarui');
};

export const deleteAppById = async (req, res, next) => {
  const { id } = req.params;

  const deleteApp = await AppsRepositories.deleteApp(id);

  if (!deleteApp) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  return response(res, 200, 'Aplikasi berhasil dihapus', deleteApp);
};