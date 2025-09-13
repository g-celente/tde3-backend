const checklistService = require('../services/checklistService');

/**
 * Controller para gerenciar requisições de checklists
 */
class ChecklistController {
  /**
   * Cria um checklist a partir de um documento
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async createChecklist(req, res, next) {
    try {
      const { documentId } = req.params;
      const { standard } = req.body;
      const userId = req.user.id;

      const checklist = await checklistService.createChecklist(documentId, standard, userId);
      
      return res.status(201).json({
        status: 'success',
        data: { checklist },
        message: 'Checklist criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca todos os checklists do usuário
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getUserChecklists(req, res, next) {
    try {
      const userId = req.user.id;
      const checklists = await checklistService.getUserChecklists(userId);
      
      return res.status(200).json({
        status: 'success',
        data: { checklists },
        message: 'Checklists recuperados com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um checklist pelo ID
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getChecklistById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const checklist = await checklistService.getChecklistById(id, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { checklist },
        message: 'Checklist recuperado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChecklistController();