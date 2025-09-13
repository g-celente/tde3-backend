const reportService = require('../services/reportService');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Controller para gerenciar requisições de relatórios
 */
class ReportController {
  /**
   * Gera um relatório PDF para um checklist
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async generatePdfReport(req, res, next) {
    try {
      const { checklistId } = req.params;
      const userId = req.user.id;

      const report = await reportService.generateChecklistReport(checklistId, userId);
      
      // Verificar se o arquivo foi gerado
      if (!fs.existsSync(report.filePath)) {
        throw new AppError('Erro ao gerar o relatório', 500);
      }

      // Enviar o arquivo para download
      res.download(
        report.filePath,
        report.fileName,
        (err) => {
          if (err) {
            next(new AppError('Erro ao fazer download do relatório', 500));
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gera um relatório PDF específico para não conformidades
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   * @param {Function} next - Próximo middleware
   */
  async generateNonConformitiesPdfReport(req, res, next) {
    try {
      const { checklistId } = req.params;
      const userId = req.user.id;

      const report = await reportService.generateNonConformitiesReport(checklistId, userId);
      
      // Verificar se o arquivo foi gerado
      if (!fs.existsSync(report.filePath)) {
        throw new AppError('Erro ao gerar o relatório de não conformidades', 500);
      }

      // Enviar o arquivo para download
      res.download(
        report.filePath,
        report.fileName,
        (err) => {
          if (err) {
            next(new AppError('Erro ao fazer download do relatório de não conformidades', 500));
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();