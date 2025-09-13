const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Utilitário para extrair texto de documentos
 * Implementação que utiliza bibliotecas específicas para cada formato:
 * - pdf-parse para arquivos PDF
 * - mammoth para arquivos DOCX
 * - fs nativo para arquivos TXT
 */
class DocumentTextExtractor {
  /**
   * Extrai texto de um documento
   * @param {String} filePath - Caminho do arquivo
   * @returns {Promise<String>} Texto extraído
   */
  async extractText(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    const extension = path.extname(filePath).toLowerCase();
    
    // Utiliza implementações específicas para cada formato
    switch (extension) {
      case '.txt':
        return this.extractFromTxt(filePath);
      case '.pdf':
        return this.extractFromPdf(filePath);
      case '.docx':
        return this.extractFromDocx(filePath);
      default:
        throw new AppError('Formato de arquivo não suportado para extração de texto', 400);
    }
  }

  /**
   * Extrai texto de um arquivo TXT
   * @param {String} filePath - Caminho do arquivo
   * @returns {Promise<String>} Texto extraído
   */
  async extractFromTxt(filePath) {
    return fs.promises.readFile(filePath, 'utf8');
  }

  /**
   * Extrai texto de um arquivo PDF usando a biblioteca pdf-parse
   * @param {String} filePath - Caminho do arquivo
   * @returns {Promise<String>} Texto extraído
   */
  async extractFromPdf(filePath) {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw new AppError('Falha ao processar o arquivo PDF', 500);
    }
  }

  /**
   * Extrai texto de um arquivo DOCX usando a biblioteca mammoth
   * @param {String} filePath - Caminho do arquivo
   * @returns {Promise<String>} Texto extraído
   */
  async extractFromDocx(filePath) {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } catch (error) {
      console.error('Erro ao extrair texto do DOCX:', error);
      throw new AppError('Falha ao processar o arquivo DOCX', 500);
    }
  }
}

module.exports = new DocumentTextExtractor();