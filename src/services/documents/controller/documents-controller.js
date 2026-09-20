import { ClientError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import fs from 'fs/promises';
import DocumentsRepositories from '../repositories/documents-repositories.js';
import path from 'path';
import { UPLOAD_FOLDER } from '../storage/documents-config.js';

export const uploadDocument = async (req, res, next) => {
  if (!req.file) {
    return next(new ClientError('required'));
  }

  const { filename, originalname, size } = req.file;
  const { id:userId } = req.user;

  const document = await DocumentsRepositories.addDocument({
    userId,
    filename,
    originalName: originalname,
    size,
  });

  return response(res, 201, 'Dokumen berhasil diunggah', document);
};

export const getDocuments = async (req, res) => {
  const documents = await DocumentsRepositories.getDocuments();
  return response(res, 200, 'Dokumen sukses ditampilkan', { documents });
};

export const getDocumentById = async (req, res, next) => {
  const { id } = req.params;
  const document = await DocumentsRepositories.getDocumentById(id);

  if (!document) {
    return next(new NotFoundError('Dokumen tidak ditemukan'));
  }

  const filePath = path.resolve(UPLOAD_FOLDER, document.filename);

  res.setHeader('Content-Type', 'application/pdf');

  res.setHeader(
    'Content-Disposition',
    `inline; filename="${document.original_name}"`
  );

  return res.sendFile(filePath);
};

export const deleteDocumentById = async (req, res, next) => {
  const { id } = req.params;

  const deletedDocument = await DocumentsRepositories.deleteDocumentById(id);

  if (!deletedDocument) {
    return next(new NotFoundError('Dokumen tidak ditemukan'));
  }

  const filePath = path.resolve(UPLOAD_FOLDER, deletedDocument.filename);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Gagal menghapus berkas fisik: ${err.message}`);
  }

  return response(res, 200, 'Dokumen berhasil dihapus');
};