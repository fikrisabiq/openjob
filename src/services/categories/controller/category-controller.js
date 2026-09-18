import CategoiesRepositories from '../repositories/categories-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createCategories = async (req, res, next) => {
  const { name } = req.validated;
  const categories = await CategoiesRepositories.createCategories({
    name
  });
  if (!categories) {
    return next(new InvariantError('Perusaha gagal ditambahkan'));
  }

  return response(res, 201, 'Kategori berhasil ditambahkan', categories);
};

export const getCategories = async (req, res) => {
  const categories = await CategoiesRepositories.getCategories();
  return response(res, 200, 'Kategori sukses ditampilkan', { categories });
};

export const getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoiesRepositories.getCategoryById(id);

  if (!category) {
    return next(new NotFoundError('Kategori tidak ditemukan'));
  }

  return response(res, 200, 'Kategori sukses ditampilkan', category);
};

export const editCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const {
    name
  } = req.validated;

  const category = await CategoiesRepositories.editCategory({
    id,
    name
  });

  if (!category) {
    return next(new NotFoundError('Kategori tidak ditemukan'));
  }

  return response(res, 200, 'Kategori berhasil diperbarui');
};

export const deleteCategoryById = async (req, res, next) => {
  const { id } = req.params;

  const deleteCategory = await CategoiesRepositories.deleteCategory(id);

  if (!deleteCategory) {
    return next(new NotFoundError('Kategori tidak ditemukan'));
  }

  return response(res, 200, 'Kategori berhasil dihapus', deleteCategory);
};