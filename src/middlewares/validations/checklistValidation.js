const { param, body } = require('express-validator');
const { SUPPORTED_STANDARDS } = require('../../services/checklistService');

/**
 * Validações para as rotas de checklists
 */
const checklistValidation = {
  createChecklist: [
    param('documentId')
      .isUUID()
      .withMessage('ID do documento inválido'),
    
    body('standard')
      .notEmpty()
      .withMessage('Norma é obrigatória')
      .custom(value => {
        if (!SUPPORTED_STANDARDS.includes(value)) {
          throw new Error(`Norma não suportada. Normas disponíveis: ${SUPPORTED_STANDARDS.join(', ')}`);
        }
        return true;
      }),
  ],
  
  getChecklist: [
    param('id')
      .isUUID()
      .withMessage('ID do checklist inválido'),
  ],
};

module.exports = checklistValidation;