# Utilitário de Extração de Texto

Este documento descreve o utilitário de extração de texto implementado para o sistema de auditoria com checklists baseados em IA.

## Visão Geral

O `documentTextExtractor.js` é responsável por extrair texto de diferentes formatos de documentos para envio à API da OpenAI. Esta extração é crucial para a geração de checklists personalizados e relevantes ao conteúdo do documento.

## Formatos Suportados

- **TXT**: Arquivos de texto simples
- **PDF**: Documentos no formato PDF
- **DOCX**: Documentos do Microsoft Word

## Implementação

### Bibliotecas Utilizadas

- **fs (nativo)**: Para arquivos TXT
- **pdf-parse**: Para arquivos PDF
- **mammoth**: Para arquivos DOCX (.docx)

### Métodos Principais

#### `extractText(filePath)`

Método principal que detecta o tipo de arquivo pela extensão e chama o extrator apropriado.

```javascript
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
```

#### `extractFromTxt(filePath)`

Extrai texto de arquivos TXT usando o módulo fs nativo.

#### `extractFromPdf(filePath)`

Extrai texto de arquivos PDF usando a biblioteca pdf-parse.

#### `extractFromDocx(filePath)`

Extrai texto de arquivos DOCX usando a biblioteca mammoth.

## Tratamento de Erros

Todos os métodos de extração incluem tratamento de erros para lidar com problemas comuns:

- Arquivo não encontrado
- Formato de arquivo não suportado
- Falhas de processamento específicas de cada formato

## Uso no Sistema

O extrator é utilizado principalmente pelo `checklistService.js` durante a criação de checklists:

```javascript
// Trecho de checklistService.js
async createChecklist(documentId, standard, userId) {
  // ...
  const document = await documentService.getDocumentById(documentId, userId);
  const documentText = await documentTextExtractor.extractText(document.filePath);
  const questions = await this.generateQuestionsWithOpenAI(documentText, standard);
  // ...
}
```

## Testes

Foram implementados dois arquivos para testar a funcionalidade de extração:

1. `extractorTest.js`: Testa cada método de extração individualmente
2. `documentFlowTest.js`: Testa o fluxo completo desde o upload do documento até a extração do texto

Para executar os testes:

```bash
node src/utils/extractorTest.js
node src/utils/documentFlowTest.js
```

## Melhorias Futuras

- Suporte para mais formatos (.rtf, .odt, etc.)
- Extração de texto de imagens (OCR)
- Melhorias na extração de textos com formatação complexa
- Cache de textos extraídos para evitar processamento repetido