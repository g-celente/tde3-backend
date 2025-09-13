const { param, body } = require('express-validator');

/**
 * Validações para as rotas de não conformidades
 */
const nonConformityValidation = {
  getNonConformities: [
    param('checklistId')
      .isUUID()
      .withMessage('ID do checklist inválido'),
  ],
  
  updateNonConformity: [
    param('id')
      .isUUID()
      .withMessage('ID da não conformidade inválido'),
    
    body('status')
      .optional()
      .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
      .withMessage('Status inválido. Use OPEN, IN_PROGRESS ou RESOLVED'),
    
    body('observation')
      .optional()
      .isString()
      .withMessage('Observação deve ser uma string'),
    
    body('description')
      .optional()
      .isString()
      .withMessage('Descrição deve ser uma string'),
  ],

  getNonConformityDetails: [
    param('id')
      .isUUID()
      .withMessage('ID da não conformidade inválido'),
  ],

  addCorrectiveAction: [
    param('id')
      .isUUID()
      .withMessage('ID da não conformidade inválido'),
    
    body('action')
      .notEmpty()
      .withMessage('Ação corretiva é obrigatória')
      .isString()
      .withMessage('Ação corretiva deve ser uma string')
      .isLength({ min: 10 })
      .withMessage('Ação corretiva deve ter pelo menos 10 caracteres'),
  ],

  resolveNonConformity: [
    param('id')
      .isUUID()
      .withMessage('ID da não conformidade inválido'),
    
    body('conclusion')
      .notEmpty()
      .withMessage('Conclusão é obrigatória')
      .isString()
      .withMessage('Conclusão deve ser uma string')
      .isLength({ min: 10 })
      .withMessage('Conclusão deve ter pelo menos 10 caracteres'),
  ],
};

module.exports = nonConformityValidation;