import CompaniesRepositories from './companies-repositories.js';
import { InvariantError, NotFoundError } from '../../exceptions/index.js';
import response from '../../utils/response.js';

export const createCompany = async (req, res, next) => {
  const { name, location, description } = req.validated;
  const { id: owner } = req.user;
  const company = await CompaniesRepositories.createCompany({
    name,
    location,
    description,
    owner
  });
  if (!company) {
    return next(new InvariantError('Perusahaan gagal ditambahkan'));
  }

  return response(res, 201, 'Perusahaan berhasil ditambahkan', company);
};

export const getCompanies = async (req, res) => {
  const { companies, source } = await CompaniesRepositories.getCompanies();
  res.setHeader('X-Data-Source', source);
  return response(res, 200, 'Perusahaan sukses ditampilkan', { companies });
};

export const getCompanyById = async (req, res, next) => {
  const { id } = req.params;

  const { company, source } = await CompaniesRepositories.getCompanyById(id);

  if (!company) {
    return next(new NotFoundError('Perusahaan tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'Perusahaan sukses ditampilkan', company);
};

export const editCompanyById = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    location,
    description
  } = req.validated;

  const company = await CompaniesRepositories.editCompany({
    id,
    name,
    location,
    description
  });

  if (!company) {
    return next(new NotFoundError('Perusahaan tidak ditemukan'));
  }

  return response(res, 200, 'Perusahaan berhasil diperbarui');
};

export const deleteCompanyById = async (req, res, next) => {
  const { id } = req.params;

  const deleteCompany = await CompaniesRepositories.deleteCompany(id);

  if (!deleteCompany) {
    return next(new NotFoundError('Perusahaan tidak ditemukan'));
  }

  return response(res, 200, 'Perusahaan berhasil dihapus', deleteCompany);
};