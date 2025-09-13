require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');
const { tokenExpirationHandler } = require('./middlewares/tokenExpirationHandler');
const { uploadErrorHandler } = require('./middlewares/uploadErrorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');

// Inicialização do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON e CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Limitador de taxa de requisições
app.use(rateLimiter(100, 60 * 1000)); // 100 requisições por minuto

// Configurar rotas
app.use('/api', routes);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware para tratamento de erros específicos
app.use(uploadErrorHandler);
app.use(tokenExpirationHandler);

// Middleware de tratamento de erros gerais
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`);
});