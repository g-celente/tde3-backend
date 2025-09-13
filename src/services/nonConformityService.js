const prisma = require('../config/prisma');
const checklistService = require('./checklistService');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Service para gerenciar não conformidades
 */
class NonConformityService {
  /**
   * Busca todas as não conformidades de um checklist
   * @param {String} checklistId - ID do checklist
   * @param {String} userId - ID do usuário
   * @returns {Array} Lista de não conformidades
   */
  async getChecklistNonConformities(checklistId, userId) {
    // Verificar se o checklist existe e pertence ao usuário
    await checklistService.getChecklistById(checklistId, userId);
    
    // Buscar as não conformidades com informações da pergunta
    const nonConformities = await prisma.nonConformity.findMany({
      where: { checklistId },
      include: {
        question: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return nonConformities;
  }

  /**
   * Atualiza uma não conformidade
   * @param {String} nonConformityId - ID da não conformidade
   * @param {Object} updateData - Dados para atualização (status, observação)
   * @param {String} userId - ID do usuário
   * @returns {Object} Não conformidade atualizada
   */
  async updateNonConformity(nonConformityId, updateData, userId) {
    // Buscar a não conformidade
    const nonConformity = await prisma.nonConformity.findUnique({
      where: { id: nonConformityId },
      include: {
        checklist: true,
      },
    });

    if (!nonConformity) {
      throw new AppError('Não conformidade não encontrada', 404);
    }

    // Verificar se o checklist pertence ao usuário
    if (nonConformity.checklist.userId !== userId) {
      throw new AppError('Acesso negado', 403);
    }

    // Validar o status, se fornecido
    if (updateData.status && !['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(updateData.status)) {
      throw new AppError('Status inválido. Use OPEN, IN_PROGRESS ou RESOLVED', 400);
    }

    // Atualizar a não conformidade
    const updatedNonConformity = await prisma.nonConformity.update({
      where: { id: nonConformityId },
      data: {
        status: updateData.status,
        observation: updateData.observation,
        description: updateData.description,
      },
      include: {
        question: true,
      },
    });

    return updatedNonConformity;
  }

  /**
   * Busca detalhes de uma não conformidade específica
   * @param {String} nonConformityId - ID da não conformidade
   * @param {String} userId - ID do usuário
   * @returns {Object} Detalhes da não conformidade
   */
  async getNonConformityDetails(nonConformityId, userId) {
    const nonConformity = await prisma.nonConformity.findUnique({
      where: { id: nonConformityId },
      include: {
        question: true,
        checklist: {
          include: {
            document: true,
          },
        },
        correctiveActions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!nonConformity) {
      throw new AppError('Não conformidade não encontrada', 404);
    }

    // Verificar se o checklist pertence ao usuário
    if (nonConformity.checklist.userId !== userId) {
      throw new AppError('Acesso negado', 403);
    }

    return nonConformity;
  }

  /**
   * Adiciona uma ação corretiva a uma não conformidade
   * @param {String} nonConformityId - ID da não conformidade
   * @param {String} action - Descrição da ação corretiva
   * @param {String} userId - ID do usuário
   * @returns {Object} Ação corretiva criada
   */
  async addCorrectiveAction(nonConformityId, action, userId) {
    // Verificar se a não conformidade existe e pertence ao usuário
    const nonConformity = await this.getNonConformityDetails(nonConformityId, userId);

    // Criar a ação corretiva
    const correctiveAction = await prisma.correctiveAction.create({
      data: {
        nonConformityId,
        action,
        createdAt: new Date(),
      },
    });

    // Atualizar o status da não conformidade para IN_PROGRESS se estiver OPEN
    if (nonConformity.status === 'OPEN') {
      await prisma.nonConformity.update({
        where: { id: nonConformityId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return correctiveAction;
  }

  /**
   * Conclui uma não conformidade
   * @param {String} nonConformityId - ID da não conformidade
   * @param {String} conclusion - Observação de conclusão
   * @param {String} userId - ID do usuário
   * @returns {Object} Não conformidade atualizada
   */
  async resolveNonConformity(nonConformityId, conclusion, userId) {
    // Verificar se a não conformidade existe e pertence ao usuário
    await this.getNonConformityDetails(nonConformityId, userId);

    // Atualizar o status para RESOLVED
    const updatedNonConformity = await prisma.nonConformity.update({
      where: { id: nonConformityId },
      data: {
        status: 'RESOLVED',
        observation: conclusion,
        resolvedAt: new Date(),
      },
      include: {
        question: true,
        correctiveActions: true,
      },
    });

    return updatedNonConformity;
  }
}

module.exports = new NonConformityService();