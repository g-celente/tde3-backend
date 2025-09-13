const { AppError } = require('./errorHandler');

/**
 * Middleware para lidar com rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Rota não encontrada: ${req.originalUrl}`, 404));
};

module.exports = {
  notFoundHandler,
};