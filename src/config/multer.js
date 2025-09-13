const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../middlewares/errorHandler');

// Definir os tipos de arquivo permitidos
const ALLOWED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

// Configuração do multer para armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.env.UPLOAD_FOLDER || 'src/uploads');
    
    // Garantir que o diretório existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Criar nome de arquivo único
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = ALLOWED_MIME_TYPES[file.mimetype];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

// Filtro para verificar tipos de arquivo
const fileFilter = (req, file, cb) => {
  if (Object.keys(ALLOWED_MIME_TYPES).includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new AppError('Tipo de arquivo não suportado. Envie apenas arquivos PDF, DOCX ou TXT.', 400));
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
});

module.exports = {
  upload,
  ALLOWED_MIME_TYPES,
};