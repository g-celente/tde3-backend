/**
 * Implementação simples de limitador de taxa de requisições
 * Em produção, seria recomendado usar bibliotecas como express-rate-limit
 */

// Armazenamento em memória para contar requisições
const requestCounts = {};

/**
 * Middleware para limitar taxa de requisições
 * @param {Number} maxRequests - Número máximo de requisições permitidas no período
 * @param {Number} windowMs - Período em milissegundos
 */
const rateLimiter = (maxRequests = 100, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    // Usar IP como identificador (em produção, pode ser mais sofisticado)
    const identifier = req.ip;
    
    // Inicializar contagem se necessário
    if (!requestCounts[identifier]) {
      requestCounts[identifier] = {
        count: 0,
        resetAt: Date.now() + windowMs,
      };
    }
    
    // Verificar se o período expirou e resetar
    if (Date.now() > requestCounts[identifier].resetAt) {
      requestCounts[identifier] = {
        count: 0,
        resetAt: Date.now() + windowMs,
      };
    }
    
    // Incrementar contagem
    requestCounts[identifier].count += 1;
    
    // Verificar se excedeu o limite
    if (requestCounts[identifier].count > maxRequests) {
      return res.status(429).json({
        status: 'error',
        message: 'Muitas requisições. Por favor, tente novamente mais tarde.',
      });
    }
    
    next();
  };
};

module.exports = {
  rateLimiter,
};