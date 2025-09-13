const prisma = require('../config/prisma');
const { hashPassword, comparePassword, generateToken } = require('../config/auth');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Service para gerenciar autenticação de usuários
 */
class AuthService {
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Object} Usuário criado (sem senha)
   */
  async register(userData) {
    const { name, email, password } = userData;

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email já está em uso', 400);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Retornar usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Autentica um usuário
   * @param {String} email - Email do usuário
   * @param {String} password - Senha do usuário
   * @returns {Object} Dados do usuário e token
   */
  async login(email, password) {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token JWT
    const token = generateToken({ id: user.id });

    // Retornar usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }
}

module.exports = new AuthService();