/**
 * Middleware para tratamento de erros centralizado
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erro do Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro no banco de dados',
      error: err.message,
    });
  }

  // Erros de validação do express-validator (via middleware de validação)
  if (err.message === 'Erro de validação' && err.errors) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.msg
      })),
    });
  }

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: err.errors,
    });
  }

  // Erros de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Não autorizado',
    });
  }

  // Erro padrão
  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
  });
};

/**
 * Classe para criar erros customizados com status code
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError,
};