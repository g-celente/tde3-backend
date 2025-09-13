const express = require('express');
const authController = require('../controllers/authController');
const authValidation = require('../middlewares/validations/authValidation');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar um novo usuário
 * @access  Público
 */
router.post(
  '/register',
  authValidation.register,
  validate,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuário e obter token
 * @access  Público
 */
router.post(
  '/login',
  authValidation.login,
  validate,
  authController.login
);

module.exports = router;