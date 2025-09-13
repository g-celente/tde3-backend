const express = require('express');
const reportController = require('../controllers/reportController');
const reportValidation = require('../middlewares/validations/reportValidation');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

/**
 * @route   GET /api/reports/:checklistId/pdf
 * @desc    Gerar relatório em PDF para um checklist
 * @access  Privado
 */
router.get(
  '/:checklistId/pdf',
  reportValidation.generatePdfReport,
  validate,
  reportController.generatePdfReport
);

/**
 * @route   GET /api/reports/:checklistId/nonconformities/pdf
 * @desc    Gerar relatório de não conformidades em PDF
 * @access  Privado
 */
router.get(
  '/:checklistId/nonconformities/pdf',
  reportValidation.generatePdfReport,
  validate,
  reportController.generateNonConformitiesPdfReport
);

module.exports = router;