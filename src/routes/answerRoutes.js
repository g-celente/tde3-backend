const express = require('express');
const answerController = require('../controllers/answerController');
const answerValidation = require('../middlewares/validations/answerValidation');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/answers/:checklistId
 * @desc    Salvar respostas para um checklist
 * @access  Privado
 */
router.post(
  '/:checklistId',
  answerValidation.saveAnswers,
  validate,
  answerController.saveAnswers
);

/**
 * @route   GET /api/answers/:checklistId
 * @desc    Buscar todas as respostas de um checklist
 * @access  Privado
 */
router.get(
  '/:checklistId',
  answerValidation.getAnswers,
  validate,
  answerController.getChecklistAnswers
);

module.exports = router;