const nonConformityService = require('../services/nonConformityService');

/**
 * Controller para gerenciar requisições de não conformidades
 */
class NonConformityController {
  /**
   * Busca todas as não conformidades de um checklist
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getChecklistNonConformities(req, res, next) {
    try {
      const { checklistId } = req.params;
      const userId = req.user.id;
      
      const nonConformities = await nonConformityService.getChecklistNonConformities(checklistId, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { nonConformities },
        message: 'Não conformidades recuperadas com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma não conformidade
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async updateNonConformity(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      
      const nonConformity = await nonConformityService.updateNonConformity(id, updateData, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { nonConformity },
        message: 'Não conformidade atualizada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca detalhes de uma não conformidade específica
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getNonConformityDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const nonConformity = await nonConformityService.getNonConformityDetails(id, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { nonConformity },
        message: 'Detalhes da não conformidade recuperados com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adiciona uma ação corretiva a uma não conformidade
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async addCorrectiveAction(req, res, next) {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const userId = req.user.id;
      
      const correctiveAction = await nonConformityService.addCorrectiveAction(id, action, userId);
      
      return res.status(201).json({
        status: 'success',
        data: { correctiveAction },
        message: 'Ação corretiva adicionada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Conclui uma não conformidade
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async resolveNonConformity(req, res, next) {
    try {
      const { id } = req.params;
      const { conclusion } = req.body;
      const userId = req.user.id;
      
      const nonConformity = await nonConformityService.resolveNonConformity(id, conclusion, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { nonConformity },
        message: 'Não conformidade concluída com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NonConformityController();