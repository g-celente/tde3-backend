const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Middleware para validar requisições com express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError('Erro de validação', 400);
    error.errors = errors.array();
    
    // Log detalhado para depuração
    console.log('Erros de validação:', JSON.stringify(errors.array(), null, 2));
    
    return next(error);
  }
  next();
};

module.exports = {
  validate,
};