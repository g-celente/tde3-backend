const { body } = require('express-validator');

/**
 * Validações para as rotas de autenticação
 */
const authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 3 })
      .withMessage('Nome deve ter pelo menos 3 caracteres'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email inválido'),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email inválido'),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Senha é obrigatória'),
  ],
};

module.exports = authValidation;