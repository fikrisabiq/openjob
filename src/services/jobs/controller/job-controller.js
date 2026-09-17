import JobsRepositories from '../repositories/jobs-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createJob = async (req, res, next) => {
  const job = await JobsRepositories.createJob(req.validated);
  if (!job) {
    return next(new InvariantError('Pekerjaan gagal ditambahkan'));
  }

  return response(res, 201, 'Pekerjaan berhasil ditambahkan', job);
};

export const getJobs = async (req, res) => {
  const jobs = await JobsRepositories.getJobs();
  return response(res, 200, 'Pekerjaan sukses ditampilkan', { jobs });
};

export const getJobById = async (req, res, next) => {
  const { id } = req.params;

  const job = await JobsRepositories.getJobById(id);

  if (!job) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  return response(res, 200, 'Pekerjaan sukses ditampilkan', { job });
};

export const getJobByCompanyId = async (req, res, next) => {
  const { companyId } = req.params;

  const job = await JobsRepositories.getJobByCompanyId(companyId);

  if (!job) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  return response(res, 200, 'Pekerjaan sukses ditampilkan', { job });
};

export const getJobByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;

  const job = await JobsRepositories.getJobByCategoryId(categoryId);

  if (!job) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  return response(res, 200, 'Pekerjaan sukses ditampilkan', { job });
};

export const editJobById = async (req, res, next) => {
  const { id } = req.params;

  const company = await JobsRepositories.editJob({ ...req.validated, id });

  if (!company) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  return response(res, 200, 'Pekerjaan berhasil diperbarui');
};

export const deleteJobById = async (req, res, next) => {
  const { id } = req.params;

  const deleteJob = await JobsRepositories.deleteJob(id);

  if (!deleteJob) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  return response(res, 200, 'Pekerjaan berhasil dihapus', deleteJob);
};