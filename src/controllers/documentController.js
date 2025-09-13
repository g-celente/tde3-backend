const documentService = require('../services/documentService');

/**
 * Controller para gerenciar requisições de documentos
 */
class DocumentController {
  /**
   * Faz upload de um documento
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async uploadDocument(req, res, next) {
    try {
      const file = req.file;
      const userId = req.user.id;

      const document = await documentService.uploadDocument(file, userId);
      
      return res.status(201).json({
        status: 'success',
        data: { document },
        message: 'Documento enviado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca todos os documentos do usuário
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getUserDocuments(req, res, next) {
    try {
      const userId = req.user.id;
      const documents = await documentService.getUserDocuments(userId);
      
      return res.status(200).json({
        status: 'success',
        data: { documents },
        message: 'Documentos recuperados com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um documento pelo ID
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getDocumentById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const document = await documentService.getDocumentById(id, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { document },
        message: 'Documento recuperado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um documento
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async deleteDocument(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await documentService.deleteDocument(id, userId);
      
      return res.status(200).json({
        status: 'success',
        data: null,
        message: 'Documento removido com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();