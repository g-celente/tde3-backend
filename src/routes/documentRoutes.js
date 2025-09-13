const express = require('express');
const documentController = require('../controllers/documentController');
const documentValidation = require('../middlewares/validations/documentValidation');
const { validate } = require('../middlewares/validationMiddleware');
const { upload } = require('../config/multer');

const router = express.Router();

/**
 * @route   POST /api/documents/upload
 * @desc    Fazer upload de um documento
 * @access  Privado
 */
router.post(
  '/upload',
  upload.single('document'),
  documentController.uploadDocument
);

/**
 * @route   GET /api/documents
 * @desc    Buscar todos os documentos do usuário
 * @access  Privado
 */
router.get(
  '/',
  documentController.getUserDocuments
);

/**
 * @route   GET /api/documents/:id
 * @desc    Buscar um documento pelo ID
 * @access  Privado
 */
router.get(
  '/:id',
  documentValidation.getDocument,
  validate,
  documentController.getDocumentById
);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Remover um documento
 * @access  Privado
 */
router.delete(
  '/:id',
  documentValidation.deleteDocument,
  validate,
  documentController.deleteDocument
);

module.exports = router;