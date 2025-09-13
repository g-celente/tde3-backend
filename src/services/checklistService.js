const openai = require('../config/openai');
const documentTextExtractor = require('../utils/documentTextExtractor');
const documentService = require('./documentService');
const prisma = require('../config/prisma');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Normas suportadas para geração de checklists
 */
const SUPPORTED_STANDARDS = [
  'ISO 9001',
  'ISO 27001',
  'PMBOK',
  'ITIL',
  'SCRUM',
  'COBIT',
];

/**
 * Service para gerenciar checklists
 */
class ChecklistService {
  /**
   * Cria um checklist a partir de um documento usando OpenAI
   * @param {String} documentId - ID do documento
   * @param {String} standard - Norma a ser aplicada
   * @param {String} userId - ID do usuário
   * @returns {Object} Checklist criado com perguntas
   */
  async createChecklist(documentId, standard, userId) {
    // Verificar se a norma é suportada
    if (!SUPPORTED_STANDARDS.includes(standard)) {
      throw new AppError(
        `Norma não suportada. Normas disponíveis: ${SUPPORTED_STANDARDS.join(', ')}`,
        400
      );
    }

    // Obter o documento
    const document = await documentService.getDocumentById(documentId, userId);

    // Extrair texto do documento
    const documentText = await documentTextExtractor.extractText(document.filePath);

    // Gerar perguntas usando OpenAI
    const questions = await this.generateQuestionsWithOpenAI(documentText, standard);

    // Criar o checklist no banco de dados
    const checklist = await prisma.checklist.create({
      data: {
        standard,
        userId,
        documentId,
        questions: {
          create: questions.map(question => ({ text: question })),
        },
      },
      include: {
        questions: true,
      },
    });

    return checklist;
  }

  /**
   * Busca todos os checklists de um usuário
   * @param {String} userId - ID do usuário
   * @returns {Array} Lista de checklists
   */
  async getUserChecklists(userId) {
    const checklists = await prisma.checklist.findMany({
      where: { userId },
      include: {
        document: {
          select: {
            id: true,
            fileName: true,
          },
        },
        questions: {
          select: {
            id: true,
            text: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return checklists;
  }

  /**
   * Busca um checklist pelo ID
   * @param {String} checklistId - ID do checklist
   * @param {String} userId - ID do usuário
   * @returns {Object} Checklist encontrado
   */
  async getChecklistById(checklistId, userId) {
    const checklist = await prisma.checklist.findFirst({
      where: {
        id: checklistId,
        userId,
      },
      include: {
        document: {
          select: {
            id: true,
            fileName: true,
          },
        },
        questions: {
          include: {
            answer: true,
          },
        },
      },
    });

    if (!checklist) {
      throw new AppError('Checklist não encontrado', 404);
    }

    return checklist;
  }

  /**
   * Gera perguntas para o checklist usando OpenAI
   * @param {String} documentText - Texto do documento
   * @param {String} standard - Norma a ser aplicada
   * @returns {Array<String>} Lista de perguntas geradas
   */
  async generateQuestionsWithOpenAI(documentText, standard) {
    try {
      // Preparar o texto para enviar à OpenAI
      // Limitar o tamanho para evitar tokens excessivos
      const truncatedText = documentText.slice(0, 6000) + (documentText.length > 6000 ? '...' : '');

      // Construir o prompt para a OpenAI
      const prompt = `
Você é um auditor especialista na norma ${standard}. 
Analise o seguinte documento de planejamento de projeto e crie até 25 perguntas de checklist 
que possam ser respondidas com SIM ou NÃO para verificar a conformidade com a norma ${standard}.

As perguntas devem:
1. Ser diretas e claras
2. Ter resposta binária (sim/não)
3. Focar em aspectos críticos da norma ${standard}
4. Ser relevantes para o conteúdo do documento
5. Ajudar a identificar não conformidades ou oportunidades de melhoria

DOCUMENTO:
${truncatedText}

FORMATO DE RESPOSTA:
Forneça apenas as perguntas, uma por linha, sem numeração ou outros caracteres.
`;

      // Chamada à API da OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      // Extrair e processar as perguntas da resposta
      const content = response.choices[0].message.content.trim();
      const questions = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && !line.startsWith('-'));

      // Limitar a 25 perguntas
      return questions.slice(0, 25);
    } catch (error) {
      console.error('Erro ao gerar perguntas com OpenAI:', error);
      
      // Em caso de falha da API, fornecer perguntas de exemplo para o MVP
      return this.generateMockQuestions(standard);
    }
  }

  /**
   * Gera perguntas de exemplo para o MVP
   * @param {String} standard - Norma a ser aplicada
   * @returns {Array<String>} Lista de perguntas de exemplo
   */
  generateMockQuestions(standard) {
    const mockQuestions = [
      `O documento está em conformidade com os requisitos de documentação da ${standard}?`,
      `Os objetivos do projeto estão claramente definidos conforme exigido pela ${standard}?`,
      `Existe um plano de gerenciamento de riscos de acordo com a ${standard}?`,
      `As responsabilidades dos stakeholders estão definidas conforme a ${standard}?`,
      `O cronograma do projeto segue as boas práticas da ${standard}?`,
      `Existe um plano de comunicação em conformidade com a ${standard}?`,
      `Os recursos necessários para o projeto estão identificados conforme a ${standard}?`,
      `Existem métricas de qualidade definidas de acordo com a ${standard}?`,
      `O projeto possui um plano de gerenciamento de mudanças conforme a ${standard}?`,
      `Os requisitos do projeto estão documentados conforme a ${standard}?`,
      `Existe um processo de aprovação definido em conformidade com a ${standard}?`,
      `O escopo do projeto está claramente delimitado conforme a ${standard}?`,
      `Existe um plano de gerenciamento de custos em conformidade com a ${standard}?`,
      `As entregas do projeto estão definidas conforme a ${standard}?`,
      `Existe um plano de gerenciamento de qualidade conforme a ${standard}?`,
      `Os critérios de aceitação estão definidos de acordo com a ${standard}?`,
      `Existe um plano de gerenciamento de stakeholders conforme a ${standard}?`,
      `O projeto possui milestones definidos conforme a ${standard}?`,
      `Existe um plano de mitigação de riscos em conformidade com a ${standard}?`,
      `O projeto possui um processo de lições aprendidas conforme a ${standard}?`,
      `As premissas do projeto estão documentadas conforme a ${standard}?`,
      `Existe um plano de gerenciamento de aquisições conforme a ${standard}?`,
      `O projeto possui indicadores de desempenho definidos conforme a ${standard}?`,
      `Existe um plano de transição/encerramento em conformidade com a ${standard}?`,
      `O projeto possui um processo de controle de versão conforme a ${standard}?`,
    ];

    return mockQuestions;
  }
}

// Exportando o serviço e as normas suportadas
const checklistService = new ChecklistService();
module.exports = checklistService;
module.exports.SUPPORTED_STANDARDS = SUPPORTED_STANDARDS;