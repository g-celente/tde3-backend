const authService = require('../services/authService');

/**
 * Controller para gerenciar requisições de autenticação
 */
class AuthController {
  /**
   * Registra um novo usuário
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async register(req, res, next) {
    try {
      const userData = req.body;
      const user = await authService.register(userData);
      
      return res.status(201).json({
        status: 'success',
        data: { user },
        message: 'Usuário registrado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Autentica um usuário existente
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      
      return res.status(200).json({
        status: 'success',
        data: { user, token },
        message: 'Login realizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();