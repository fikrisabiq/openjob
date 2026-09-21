/* eslint-disable camelcase */
import AppsRepositories from '../repositories/applications-repositories.js';
import ProducerService from '../../rabbitmq/producerService.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createApp = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;

  const isAppExist  = await AppsRepositories.verifyUserAlreadyApplied({
    user_id, job_id,
  });

  if (isAppExist) {
    return next(new InvariantError('Gagal menambahkan aplikasi. Pekerjaan sudah dilamar oleh user.'));
  }

  const application = await AppsRepositories.createApp({
    user_id,
    job_id,
    status
  });

  if (!application) {
    return next(new InvariantError('Aplikasi gagal ditambahkan'));
  }

  const message = JSON.stringify({
    application_id: application.id
  });

  await ProducerService.sendMessage('application:notify', message);

  return response(res, 201, 'Aplikasi berhasil ditambahkan', application);
};

export const getApps = async (req, res) => {
  const { applications, source } = await AppsRepositories.getApps();
  res.setHeader('X-Data-Source', source);
  return response(res, 200, 'Aplikasi sukses ditampilkan', { applications });
};

export const getAppByUserId = async (req, res, next) => {
  const { userId } = req.params;

  const { applications, source } = await AppsRepositories.getAppByUserId(userId);

  if (!applications) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Aplikasi sukses ditampilkan', { applications });
};

export const getAppByJobId = async (req, res, next) => {
  const { JobId } = req.params;

  const { applications, source } = await AppsRepositories.getAppByJobId(JobId);

  if (!applications) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Aplikasi sukses ditampilkan', { applications });
};

export const getAppById = async (req, res, next) => {
  const { id } = req.params;

  const { application, source } = await AppsRepositories.getAppById(id);

  if (!application) {
    return next(new NotFoundError('Aplikasi tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Aplikasi sukses ditampilkan', application);
};

export const editAppById = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.validated;
  const application = await AppsRepositories.editApp({
    id,
    status
  });

  if (!application) {
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