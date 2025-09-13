const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

/**
 * Middleware para lidar com a expiração de token
 */
const tokenExpirationHandler = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expirado. Por favor, faça login novamente.',
    });
  }
  next(err);
};

module.exports = {
  tokenExpirationHandler,
};