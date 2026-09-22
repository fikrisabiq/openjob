import UserRepositories from './user-repositories.js';
import response from '../../utils/response.js';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';

export const createUser = async (req, res, next) => {
  const { name, email, password, role } = req.validated;

  const isEmailExist = await UserRepositories.verifyNewEmail(email);

  if (isEmailExist) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
  }

  const user = await UserRepositories.createUser({
    name,
    email,
    password,
    role
  });

  if (!user) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil ditambahkan', user);
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const { user, source } = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  res.setHeader('X-Data-Source', source);

  return response(res, 200, 'User berhasil ditampilkan', user);
};