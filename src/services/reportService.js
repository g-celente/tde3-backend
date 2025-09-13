const path = require('path');
const fs = require('fs');
const checklistService = require('./checklistService');
const nonConformityService = require('./nonConformityService');
const answerService = require('./answerService');
const pdfGenerator = require('../utils/pdfGenerator');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Service para gerenciar geração de relatórios
 */
class ReportService {
  /**
   * Gera um relatório PDF para um checklist
   * @param {String} checklistId - ID do checklist
   * @param {String} userId - ID do usuário
   * @returns {Object} Dados do relatório gerado
   */
  async generateChecklistReport(checklistId, userId) {
    // Obter os dados do checklist
    const checklist = await checklistService.getChecklistById(checklistId, userId);
    
    // Obter todas as não conformidades
    const nonConformities = await nonConformityService.getChecklistNonConformities(checklistId, userId);
    
    // Preparar os dados para o relatório
    const reportData = {
      ...checklist,
      nonConformities,
      createdAt: new Date().toISOString(),
    };

    // Criar diretório para relatórios se não existir
    const reportsDir = path.resolve('src/uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Definir nome do arquivo
    const fileName = `report-${checklistId}-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    // Gerar o PDF
    await pdfGenerator.generateChecklistReport(reportData, filePath);

    return {
      fileName,
      filePath,
      checklistId,
    };
  }

  /**
   * Gera um relatório PDF específico para não conformidades
   * @param {String} checklistId - ID do checklist
   * @param {String} userId - ID do usuário
   * @returns {Object} Dados do relatório gerado
   */
  async generateNonConformitiesReport(checklistId, userId) {
    // Obter os dados do checklist
    const checklist = await checklistService.getChecklistById(checklistId, userId);
    
    // Obter todas as não conformidades com detalhes
    const nonConformities = await Promise.all(
      (await nonConformityService.getChecklistNonConformities(checklistId, userId))
        .map(async (nc) => {
          return await nonConformityService.getNonConformityDetails(nc.id, userId);
        })
    );

    // Preparar os dados para o relatório
    const reportData = {
      checklist,
      nonConformities,
      totalNonConformities: nonConformities.length,
      openCount: nonConformities.filter(nc => nc.status === 'OPEN').length,
      inProgressCount: nonConformities.filter(nc => nc.status === 'IN_PROGRESS').length,
      resolvedCount: nonConformities.filter(nc => nc.status === 'RESOLVED').length,
      createdAt: new Date().toISOString(),
    };

    // Criar diretório para relatórios se não existir
    const reportsDir = path.resolve('src/uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Definir nome do arquivo
    const fileName = `nonconformities-report-${checklistId}-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    // Gerar o PDF
    await pdfGenerator.generateNonConformitiesReport(reportData, filePath);

    return {
      fileName,
      filePath,
      checklistId,
      totalNonConformities: reportData.totalNonConformities,
    };
  }
}

module.exports = new ReportService();