const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Utilitário para gerar relatórios em PDF
 */
class PDFGenerator {
  /**
   * Gera um relatório PDF para um checklist
   * @param {Object} checklistData - Dados do checklist com perguntas, respostas e não conformidades
   * @param {String} outputPath - Caminho para salvar o arquivo PDF
   * @returns {Promise<String>} Caminho do arquivo PDF gerado
   */
  async generateChecklistReport(checklistData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Criar um novo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Relatório de Auditoria - ${checklistData.standard}`,
            Author: 'Sistema de Auditoria com IA',
            Subject: 'Relatório de Checklist',
          },
        });

        // Criar o stream para escrever o PDF
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Eventos para controlar o final da escrita
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);

        // Adicionar cabeçalho
        this.addHeader(doc, checklistData);
        
        // Adicionar informações do documento
        this.addDocumentInfo(doc, checklistData);
        
        // Adicionar perguntas e respostas
        this.addQuestionsSection(doc, checklistData);
        
        // Adicionar seção de não conformidades
        this.addNonConformitiesSection(doc, checklistData);
        
        // Adicionar rodapé
        this.addFooter(doc);

        // Finalizar o documento
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adiciona o cabeçalho ao PDF
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} checklistData - Dados do checklist
   */
  addHeader(doc, checklistData) {
    // Título
    doc.font('Helvetica-Bold')
       .fontSize(20)
       .text('RELATÓRIO DE AUDITORIA', { align: 'center' });
    
    doc.moveDown();
    
    // Informações do checklist
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text(`Norma: ${checklistData.standard}`, { align: 'center' });
    
    doc.font('Helvetica')
       .fontSize(12)
       .text(`Data: ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    doc.moveDown(2);
  }

  /**
   * Adiciona informações do documento ao PDF
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} checklistData - Dados do checklist
   */
  addDocumentInfo(doc, checklistData) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('Informações do Documento');
    
    doc.moveDown(0.5);
    
    doc.font('Helvetica')
       .fontSize(12)
       .text(`Nome do Documento: ${checklistData.document.fileName}`);
    
    doc.moveDown(2);
  }

  /**
   * Adiciona seção de perguntas e respostas ao PDF
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} checklistData - Dados do checklist
   */
  addQuestionsSection(doc, checklistData) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('Questões e Respostas', { underline: true });
    
    doc.moveDown();

    // Tabela de perguntas e respostas
    checklistData.questions.forEach((question, index) => {
      // Determinar cor com base na resposta
      const hasAnswer = question.answer !== null;
      const isCompliant = hasAnswer && question.answer.response;
      
      // Índice e texto da pergunta
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(`${index + 1}. ${question.text}`, { continued: true });
      
      // Resposta
      if (hasAnswer) {
        doc.font('Helvetica')
           .fillColor(isCompliant ? 'green' : 'red')
           .text(` [${isCompliant ? 'SIM' : 'NÃO'}]`);
      } else {
        doc.font('Helvetica')
           .fillColor('grey')
           .text(' [NÃO RESPONDIDO]');
      }
      
      // Resetar cor
      doc.fillColor('black');
      doc.moveDown(0.5);
    });
    
    doc.moveDown(2);
  }

  /**
   * Adiciona seção de não conformidades ao PDF
   * @param {PDFDocument} doc - Documento PDF
   * @param {Object} checklistData - Dados do checklist
   */
  addNonConformitiesSection(doc, checklistData) {
    // Filtrar perguntas com respostas "Não" para identificar não conformidades
    const nonConformities = checklistData.questions.filter(
      question => question.answer && !question.answer.response
    );
    
    if (nonConformities.length === 0) {
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .text('Não Conformidades', { underline: true });
      
      doc.moveDown(0.5);
      
      doc.font('Helvetica')
         .fontSize(12)
         .text('Nenhuma não conformidade identificada.', { align: 'center' });
      
      doc.moveDown(2);
      return;
    }

    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('Não Conformidades', { underline: true });
    
    doc.moveDown();

    // Para cada não conformidade
    nonConformities.forEach((question, index) => {
      // Buscar a não conformidade correspondente
      const nc = checklistData.nonConformities.find(nc => nc.questionId === question.id);
      
      // Título da não conformidade
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(`NC ${index + 1}: ${question.text}`);
      
      // Status
      doc.font('Helvetica')
         .fontSize(10)
         .text(`Status: ${nc ? this.formatStatus(nc.status) : 'Aberta'}`);
      
      // Descrição e observações
      if (nc && nc.description) {
        doc.text(`Descrição: ${nc.description}`);
      }
      
      if (nc && nc.observation) {
        doc.text(`Observações: ${nc.observation}`);
      }
      
      doc.moveDown();
    });
    
    doc.moveDown();
  }

  /**
   * Formata o status para exibição
   * @param {String} status - Status da não conformidade
   * @returns {String} Status formatado
   */
  formatStatus(status) {
    const statusMap = {
      'OPEN': 'Aberta',
      'IN_PROGRESS': 'Em andamento',
      'RESOLVED': 'Corrigida',
    };
    return statusMap[status] || status;
  }

  /**
   * Adiciona rodapé ao PDF
   * @param {PDFDocument} doc - Documento PDF
   */
  addFooter(doc) {
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // Salvar posição atual
      const originalY = doc.y;
      
      // Ir para o rodapé
      doc.page.margins.bottom = 50;
      doc.y = doc.page.height - doc.page.margins.bottom;
      
      // Adicionar texto do rodapé
      doc.font('Helvetica')
         .fontSize(8)
         .text(
           `Relatório gerado pelo Sistema de Auditoria com IA | Página ${i + 1} de ${pageCount}`,
           { align: 'center' }
         );
      
      // Restaurar posição
      doc.y = originalY;
    }
  }

  /**
   * Gera um relatório PDF específico para não conformidades
   * @param {Object} reportData - Dados do relatório de não conformidades
   * @param {String} outputPath - Caminho para salvar o arquivo PDF
   * @returns {Promise<String>} Caminho do arquivo PDF gerado
   */
  async generateNonConformitiesReport(reportData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Criar um novo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Relatório de Não Conformidades - ${reportData.checklist.standard}`,
            Author: 'Sistema de Auditoria com IA',
            Subject: 'Relatório de Não Conformidades',
          },
        });

        // Criar o stream para escrever o PDF
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Eventos para controlar o final da escrita
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);

        // Adicionar cabeçalho
        this.addNonConformitiesHeader(doc, reportData);
        
        // Adicionar resumo estatístico
        this.addNonConformitiesStatistics(doc, reportData);
        
        // Adicionar detalhes das não conformidades
        this.addNonConformitiesDetails(doc, reportData);
        
        // Adicionar rodapé
        this.addFooter(doc);

        // Finalizar o documento
        doc.end();
      } catch (error) {
        reject(new AppError(`Erro ao gerar relatório PDF: ${error.message}`, 500));
      }
    });
  }

  /**
   * Adiciona cabeçalho específico para relatório de não conformidades
   */
  addNonConformitiesHeader(doc, reportData) {
    // Título principal
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('RELATÓRIO DE NÃO CONFORMIDADES', { align: 'center' });
    
    doc.moveDown(0.5);
    
    // Informações do checklist
    doc.fontSize(12)
       .text(`Checklist: ${reportData.checklist.standard}`, { align: 'center' });
    
    doc.fontSize(10)
       .text(`Documento: ${reportData.checklist.document.fileName}`, { align: 'center' });
    
    doc.text(`Gerado em: ${new Date(reportData.createdAt).toLocaleString('pt-BR')}`, { align: 'center' });
    
    doc.moveDown(1);
    
    // Linha separadora
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();
    
    doc.moveDown(1);
  }

  /**
   * Adiciona estatísticas das não conformidades
   */
  addNonConformitiesStatistics(doc, reportData) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('RESUMO ESTATÍSTICO');
    
    doc.moveDown(0.5);
    
    doc.font('Helvetica')
       .fontSize(11);
    
    // Criar tabela de estatísticas
    const stats = [
      ['Total de Não Conformidades:', reportData.totalNonConformities.toString()],
      ['Abertas:', reportData.openCount.toString()],
      ['Em Andamento:', reportData.inProgressCount.toString()],
      ['Resolvidas:', reportData.resolvedCount.toString()],
    ];
    
    let yPosition = doc.y;
    
    stats.forEach(([label, value]) => {
      doc.text(label, 70, yPosition, { width: 200 });
      doc.text(value, 300, yPosition, { width: 100 });
      yPosition += 20;
    });
    
    doc.y = yPosition + 10;
    
    // Linha separadora
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();
    
    doc.moveDown(1);
  }

  /**
   * Adiciona detalhes de cada não conformidade
   */
  addNonConformitiesDetails(doc, reportData) {
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('DETALHES DAS NÃO CONFORMIDADES');
    
    doc.moveDown(1);
    
    reportData.nonConformities.forEach((nc, index) => {
      // Verificar espaço na página
      if (doc.y > 700) {
        doc.addPage();
      }
      
      // Título da não conformidade
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(`${index + 1}. Não Conformidade #${nc.id.substring(0, 8)}`);
      
      doc.moveDown(0.3);
      
      // Status com cor
      const statusColor = this.getStatusColor(nc.status);
      doc.fillColor(statusColor)
         .text(`Status: ${this.getStatusLabel(nc.status)}`);
      
      doc.fillColor('black');
      doc.moveDown(0.3);
      
      // Pergunta relacionada
      doc.font('Helvetica')
         .fontSize(10)
         .text(`Pergunta: ${nc.question.text}`, { width: 500 });
      
      doc.moveDown(0.3);
      
      // Descrição se existir
      if (nc.description) {
        doc.text(`Descrição: ${nc.description}`, { width: 500 });
        doc.moveDown(0.3);
      }
      
      // Ações corretivas
      if (nc.correctiveActions && nc.correctiveActions.length > 0) {
        doc.font('Helvetica-Bold')
           .text('Ações Corretivas:');
        
        nc.correctiveActions.forEach((action, actionIndex) => {
          doc.font('Helvetica')
             .fontSize(9)
             .text(`${actionIndex + 1}. ${action.action}`, { 
               indent: 20, 
               width: 480,
               lineGap: 2 
             });
          
          doc.text(`   Data: ${new Date(action.createdAt).toLocaleDateString('pt-BR')}`, {
            indent: 20,
            fontSize: 8
          });
        });
        
        doc.moveDown(0.3);
      }
      
      // Observações
      if (nc.observation) {
        doc.font('Helvetica-Bold')
           .text('Observações:');
        doc.font('Helvetica')
           .text(nc.observation, { width: 500 });
        doc.moveDown(0.3);
      }
      
      // Data de resolução
      if (nc.resolvedAt) {
        doc.font('Helvetica')
           .fontSize(9)
           .text(`Resolvida em: ${new Date(nc.resolvedAt).toLocaleString('pt-BR')}`);
      }
      
      doc.moveDown(0.5);
      
      // Linha separadora entre não conformidades
      doc.moveTo(70, doc.y)
         .lineTo(530, doc.y)
         .strokeColor('#CCCCCC')
         .stroke()
         .strokeColor('black');
      
      doc.moveDown(0.5);
    });
  }

  /**
   * Retorna a cor para o status
   */
  getStatusColor(status) {
    switch (status) {
      case 'OPEN': return '#FF6B6B';
      case 'IN_PROGRESS': return '#4ECDC4';
      case 'RESOLVED': return '#45B7D1';
      default: return 'black';
    }
  }

  /**
   * Retorna o label traduzido para o status
   */
  getStatusLabel(status) {
    switch (status) {
      case 'OPEN': return 'Aberta';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'RESOLVED': return 'Resolvida';
      default: return status;
    }
  }
}

module.exports = new PDFGenerator();