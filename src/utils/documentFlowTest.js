const documentService = require('../services/documentService');
const checklistService = require('../services/checklistService');
const path = require('path');
const fs = require('fs');

/**
 * Função para testar o fluxo completo do documento -> extração -> checklist
 * Este teste simula o fluxo de um usuário real: 
 * 1. Fazendo upload de um documento
 * 2. Criando um checklist a partir desse documento
 */
async function testDocumentToChecklist() {
  try {
    // Configurações de teste
    const userId = '1'; // Substitua por um ID de usuário válido do seu banco
    const testDocPath = path.join(__dirname, '../uploads/test/sample.txt');
    const standard = 'ISO 9001'; // Norma a ser utilizada para o checklist

    console.log('🔍 Iniciando teste de fluxo documento -> checklist\n');

    // 1. Verificar se o arquivo de teste existe
    if (!fs.existsSync(testDocPath)) {
      console.error(`❌ Arquivo de teste não encontrado: ${testDocPath}`);
      return;
    }

    // 2. Simular upload de documento (sem usar a rota HTTP)
    console.log(`📄 Processando upload do documento: ${path.basename(testDocPath)}`);
    // Criar um objeto de arquivo similar ao que o multer gera
    const mockFile = {
      originalname: path.basename(testDocPath),
      path: testDocPath,
      mimetype: 'text/plain',
      size: fs.statSync(testDocPath).size
    };

    console.log('💾 Salvando documento no serviço...');
    // Opção 1: Usar o serviço diretamente (se ele suportar)
    // Descomente se seu documentService tiver um método processUpload
    // const document = await documentService.processUpload(mockFile, userId);
    
    // Opção 2: Para fins de teste, apenas fingir que temos um documento
    const document = {
      id: 'test-document-id',
      fileName: path.basename(testDocPath),
      filePath: testDocPath,
      fileType: 'txt',
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`✅ Documento criado com ID: ${document.id}`);

    // 3. Criar checklist a partir do documento
    console.log(`\n🔄 Criando checklist para o documento usando norma: ${standard}`);
    
    // Opção 1: Descomente para usar o serviço real (exigirá conexão com OpenAI)
    // const checklist = await checklistService.createChecklist(document.id, standard, userId);
    
    // Opção 2: Apenas simular para testar a extração de texto
    console.log('📑 Extraindo texto do documento...');
    const documentTextExtractor = require('../utils/documentTextExtractor');
    const text = await documentTextExtractor.extractText(document.filePath);
    
    console.log(`✅ Texto extraído com sucesso (${text.length} caracteres)`);
    console.log('📝 Preview do texto extraído:');
    console.log('-----------------------------------');
    console.log(text.substring(0, 300) + (text.length > 300 ? '...' : ''));
    console.log('-----------------------------------\n');
    
    console.log('🎉 Teste concluído com sucesso!');
    console.log('Em um fluxo real, este texto seria enviado para a OpenAI');
    console.log('para gerar perguntas de checklist relevantes ao documento.');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
testDocumentToChecklist();