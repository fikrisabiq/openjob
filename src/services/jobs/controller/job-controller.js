
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

export const getJobs = async (req, res, next) => {
  const { title, 'company-name': companyName } = req.query;

  const { jobs, source } = await JobsRepositories.getJobs({
    title,
    companyName,
  });

  if (!jobs) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Pekerjaan sukses ditampilkan', { jobs });
};

export const getJobById = async (req, res, next) => {
  const { id } = req.params;

  const { job, source } = await JobsRepositories.getJobById(id);

  if (!job) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Pekerjaan sukses ditampilkan', job);
};

export const getJobByCompanyId = async (req, res, next) => {
  const { companyId } = req.params;

  const { jobs, source } = await JobsRepositories.getJobByCompanyId(companyId);

  if (!jobs) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }
  res.setHeader('X-Data-Source', source);
  return response(res, 200, 'Pekerjaan sukses ditampilkan', { jobs });
};

export const getJobByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;

  const { jobs, source } = await JobsRepositories.getJobByCategoryId(categoryId);

  if (!jobs) {
    return next(new NotFoundError('Pekerjaan tidak ditemukan'));
  }
  res.setHeader('X-Data-Source', source);
  return response(res, 200, 'Pekerjaan sukses ditampilkan', { jobs });
};

export const editJobById = async (req, res, next) => {
  const { id } = req.params;

  const company = await JobsRepositories.editJob(id, { ...req.validated });

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