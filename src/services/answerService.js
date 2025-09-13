const prisma = require('../config/prisma');
const checklistService = require('./checklistService');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Service para gerenciar respostas do checklist
 */
class AnswerService {
  /**
   * Registra respostas para um checklist
   * @param {String} checklistId - ID do checklist
   * @param {Array} answers - Array com as respostas {questionId, response}
   * @param {String} userId - ID do usuário
   * @returns {Object} Dados das respostas salvas
   */
  async saveAnswers(checklistId, answers, userId) {
    // Verificar se o checklist existe e pertence ao usuário
    const checklist = await checklistService.getChecklistById(checklistId, userId);
    
    // Mapear os IDs das perguntas do checklist
    const questionIds = checklist.questions.map(q => q.id);
    
    // Verificar se todas as perguntas enviadas pertencem ao checklist
    for (const answer of answers) {
      if (!questionIds.includes(answer.questionId)) {
        throw new AppError(`A pergunta com ID ${answer.questionId} não pertence a este checklist`, 400);
      }
    }

    const savedAnswers = [];
    const nonConformities = [];

    // Processar cada resposta individualmente
    for (const answer of answers) {
      try {
        // 1. Salvar ou atualizar a resposta
        const existingAnswer = await prisma.answer.findUnique({
          where: { questionId: answer.questionId },
        });

        const savedAnswer = existingAnswer
          ? await prisma.answer.update({
              where: { id: existingAnswer.id },
              data: { response: answer.response },
            })
          : await prisma.answer.create({
              data: {
                questionId: answer.questionId,
                response: answer.response,
              },
            });

        savedAnswers.push(savedAnswer);

        // 2. Gerenciar não conformidades
        const existingNC = await prisma.nonConformity.findFirst({
          where: { questionId: answer.questionId },
        });

        if (!answer.response) {
          // Resposta "Não" - criar ou manter não conformidade
          if (!existingNC) {
            const nonConformity = await prisma.nonConformity.create({
              data: {
                questionId: answer.questionId,
                checklistId: checklistId,
                status: 'OPEN',
              },
            });
            nonConformities.push(nonConformity);
          } else {
            // Já existe, apenas adicionar à lista de retorno
            nonConformities.push(existingNC);
          }
        } else {
          // Resposta "Sim" - remover não conformidade se existir
          if (existingNC) {
            await prisma.nonConformity.delete({
              where: { id: existingNC.id },
            });
          }
        }
      } catch (error) {
        console.error(`Erro ao processar resposta para pergunta ${answer.questionId}:`, error);
        throw new AppError(`Erro ao salvar resposta para a pergunta ${answer.questionId}`, 500);
      }
    }

    return { savedAnswers, nonConformities };
  }

  /**
   * Busca todas as respostas de um checklist
   * @param {String} checklistId - ID do checklist
   * @param {String} userId - ID do usuário
   * @returns {Array} Lista de respostas
   */
  async getChecklistAnswers(checklistId, userId) {
    // Verificar se o checklist existe e pertence ao usuário
    await checklistService.getChecklistById(checklistId, userId);
    
    // Buscar as perguntas com suas respostas
    const questionsWithAnswers = await prisma.question.findMany({
      where: { checklistId },
      include: {
        answer: true,
      },
    });

    return questionsWithAnswers;
  }
}

module.exports = new AnswerService();