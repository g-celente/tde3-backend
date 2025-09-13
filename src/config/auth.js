const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Configuração para geração e verificação de tokens JWT
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

/**
 * Gera um token JWT
 * @param {Object} payload - Dados para incluir no token
 * @returns {String} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

/**
 * Compara a senha fornecida com o hash armazenado
 * @param {String} password - Senha em texto puro
 * @param {String} hashedPassword - Hash da senha armazenada
 * @returns {Boolean} Verdadeiro se as senhas coincidem
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Gera um hash para a senha
 * @param {String} password - Senha em texto puro
 * @returns {String} Hash da senha
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = {
  jwtConfig,
  generateToken,
  comparePassword,
  hashPassword,
};