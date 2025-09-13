const { param } = require('express-validator');

/**
 * Validações para as rotas de relatórios
 */
const reportValidation = {
  generatePdfReport: [
    param('checklistId')
      .isUUID()
      .withMessage('ID do checklist inválido'),
  ],
};

module.exports = reportValidation;