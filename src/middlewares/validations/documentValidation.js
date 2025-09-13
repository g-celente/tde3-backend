const { param } = require('express-validator');

/**
 * Validações para as rotas de documentos
 */
const documentValidation = {
  getDocument: [
    param('id')
      .isUUID()
      .withMessage('ID do documento inválido'),
  ],
  
  deleteDocument: [
    param('id')
      .isUUID()
      .withMessage('ID do documento inválido'),
  ],
};

module.exports = documentValidation;