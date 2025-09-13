const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/config/auth');
const prisma = new PrismaClient();

/**
 * Seed do banco de dados para ambiente de desenvolvimento
 */
async function main() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // Criar usuário administrador
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: adminPassword,
      },
    });

    console.log('Usuário admin criado:', admin.email);

    // Criar usuário de teste
    const userPassword = await hashPassword('user123');
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        name: 'Usuário Teste',
        email: 'user@example.com',
        password: userPassword,
      },
    });

    console.log('Usuário de teste criado:', user.email);
    
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();