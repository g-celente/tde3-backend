const documentTextExtractor = require('../utils/documentTextExtractor');
const path = require('path');

/**
 * Função para testar a extração de texto de documentos
 */
async function testExtractor() {
  try {
    // Caminhos para os arquivos de teste
    const txtFile = path.join(__dirname, '../uploads/test/sample.txt');
    
    // Array de arquivos a testar - apenas o TXT por enquanto
    const files = [
      { path: txtFile, type: 'TXT' },
      // Comente os formatos que você não tem arquivos de teste ainda
      // { path: pdfFile, type: 'PDF' },
      // { path: docxFile, type: 'DOCX' },
    ];
    
    console.log('Iniciando testes de extração de texto...\n');
    
    for (const file of files) {
      try {
        console.log(`Testando extração de arquivo ${file.type}: ${file.path}`);
        
        // Tenta extrair o texto
        const text = await documentTextExtractor.extractText(file.path);
        
        // Exibe um preview do texto extraído (primeiros 150 caracteres)
        const preview = text.substring(0, 150).replace(/\n/g, ' ') + 
          (text.length > 150 ? '...' : '');
        
        console.log(`✅ Sucesso! Preview: "${preview}"\n`);
      } catch (error) {
        console.log(`❌ Erro: ${error.message}\n`);
      }
    }
    
    console.log('Testes concluídos.');
  } catch (error) {
    console.error('Erro ao executar testes:', error);
  }
}

// Executa os testes
testExtractor();