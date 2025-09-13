const express = require('express');
const checklistController = require('../controllers/checklistController');
const checklistValidation = require('../middlewares/validations/checklistValidation');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/checklists/create/:documentId
 * @desc    Criar checklist a partir de um documento
 * @access  Privado
 */
router.post(
  '/create/:documentId',
  checklistValidation.createChecklist,
  validate,
  checklistController.createChecklist
);

/**
 * @route   GET /api/checklists
 * @desc    Buscar todos os checklists do usuário
 * @access  Privado
 */
router.get(
  '/',
  checklistController.getUserChecklists
);

/**
 * @route   GET /api/checklists/:id
 * @desc    Buscar um checklist pelo ID
 * @access  Privado
 */
router.get(
  '/:id',
  checklistValidation.getChecklist,
  validate,
  checklistController.getChecklistById
);

module.exports = router;