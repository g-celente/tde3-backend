/**
 * Middleware para lidar com erros de upload de arquivos
 */
const uploadErrorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'error',
      message: 'Arquivo excede o tamanho máximo permitido.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      status: 'error',
      message: 'Campo de arquivo inesperado.',
    });
  }

  if (err.code === 'LIMIT_PART_COUNT') {
    return res.status(400).json({
      status: 'error',
      message: 'Muitas partes no envio multipart.',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      status: 'error',
      message: 'Muitos arquivos enviados.',
    });
  }

  next(err);
};

module.exports = {
  uploadErrorHandler,
};