const { param, body } = require('express-validator');

/**
 * Validações para as rotas de respostas
 */
const answerValidation = {
  saveAnswers: [
    param('checklistId')
      .isUUID()
      .withMessage('ID do checklist inválido'),
    
    body('answers')
      .isArray()
      .withMessage('As respostas devem ser um array')
      .notEmpty()
      .withMessage('O array de respostas não pode estar vazio'),
    
    body('answers.*.questionId')
      .isUUID()
      .withMessage('ID da pergunta inválido'),
    
    body('answers.*.response')
      .isBoolean()
      .withMessage('A resposta deve ser um booleano (true para Sim, false para Não)'),
  ],
  
  getAnswers: [
    param('checklistId')
      .isUUID()
      .withMessage('ID do checklist inválido'),
  ],
};

module.exports = answerValidation;