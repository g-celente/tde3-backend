const express = require('express');
const nonConformityController = require('../controllers/nonConformityController');
const nonConformityValidation = require('../middlewares/validations/nonConformityValidation');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

/**
 * @route   GET /api/nonconformities/:checklistId
 * @desc    Buscar todas as não conformidades de um checklist
 * @access  Privado
 */
router.get(
  '/:checklistId',
  nonConformityValidation.getNonConformities,
  validate,
  nonConformityController.getChecklistNonConformities
);

/**
 * @route   PUT /api/nonconformities/:id
 * @desc    Atualizar uma não conformidade
 * @access  Privado
 */
router.put(
  '/:id',
  nonConformityValidation.updateNonConformity,
  validate,
  nonConformityController.updateNonConformity
);

/**
 * @route   GET /api/nonconformities/details/:id
 * @desc    Buscar detalhes de uma não conformidade específica
 * @access  Privado
 */
router.get(
  '/details/:id',
  nonConformityValidation.getNonConformityDetails,
  validate,
  nonConformityController.getNonConformityDetails
);

/**
 * @route   POST /api/nonconformities/:id/corrective-action
 * @desc    Adicionar ação corretiva a uma não conformidade
 * @access  Privado
 */
router.post(
  '/:id/corrective-action',
  nonConformityValidation.addCorrectiveAction,
  validate,
  nonConformityController.addCorrectiveAction
);

/**
 * @route   PUT /api/nonconformities/:id/resolve
 * @desc    Concluir uma não conformidade
 * @access  Privado
 */
router.put(
  '/:id/resolve',
  nonConformityValidation.resolveNonConformity,
  validate,
  nonConformityController.resolveNonConformity
);

module.exports = router;