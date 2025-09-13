const prisma = require('../config/prisma');
const fs = require('fs');
const path = require('path');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Service para gerenciar documentos
 */
class DocumentService {
  /**
   * Armazena um documento no sistema
   * @param {Object} file - Arquivo enviado pelo multer
   * @param {String} userId - ID do usuário que fez o upload
   * @returns {Object} Documento criado
   */
  async uploadDocument(file, userId) {
    if (!file) {
      throw new AppError('Nenhum arquivo foi enviado', 400);
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Remover o arquivo enviado caso o usuário não exista
      fs.unlinkSync(file.path);
      throw new AppError('Usuário não encontrado', 404);
    }

    // Criar o documento no banco de dados
    const document = await prisma.document.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,
        fileType: path.extname(file.originalname).slice(1),
        userId,
      },
    });

    return document;
  }

  /**
   * Busca todos os documentos de um usuário
   * @param {String} userId - ID do usuário
   * @returns {Array} Lista de documentos
   */
  async getUserDocuments(userId) {
    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return documents;
  }

  /**
   * Busca um documento pelo ID
   * @param {String} documentId - ID do documento
   * @param {String} userId - ID do usuário
   * @returns {Object} Documento encontrado
   */
  async getDocumentById(documentId, userId) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      throw new AppError('Documento não encontrado', 404);
    }

    return document;
  }

  /**
   * Remove um documento
   * @param {String} documentId - ID do documento
   * @param {String} userId - ID do usuário
   * @returns {Object} Documento removido
   */
  async deleteDocument(documentId, userId) {
    // Buscar o documento
    const document = await this.getDocumentById(documentId, userId);

    // Verificar se o arquivo existe e remover
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Remover do banco de dados
    const deletedDocument = await prisma.document.delete({
      where: { id: documentId },
    });

    return deletedDocument;
  }
}

module.exports = new DocumentService();