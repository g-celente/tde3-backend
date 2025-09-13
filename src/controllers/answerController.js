const answerService = require('../services/answerService');

/**
 * Controller para gerenciar requisições de respostas do checklist
 */
class AnswerController {
  /**
   * Salva respostas para um checklist
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async saveAnswers(req, res, next) {
    try {
      const { checklistId } = req.params;
      const { answers } = req.body;
      const userId = req.user.id;

      const result = await answerService.saveAnswers(checklistId, answers, userId);
      
      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'Respostas salvas com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca todas as respostas de um checklist
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async getChecklistAnswers(req, res, next) {
    try {
      const { checklistId } = req.params;
      const userId = req.user.id;
      
      const answers = await answerService.getChecklistAnswers(checklistId, userId);
      
      return res.status(200).json({
        status: 'success',
        data: { answers },
        message: 'Respostas recuperadas com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnswerController();