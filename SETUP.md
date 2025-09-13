# Instruções para Inicialização do Projeto

Este documento fornece instruções detalhadas para configurar e iniciar o projeto de sistema de auditoria com checklists baseados em IA.

## Pré-requisitos

Certifique-se de que você tem os seguintes softwares instalados:

1. **Node.js** (versão LTS recomendada, 16.x ou superior)
2. **PostgreSQL** (versão 12 ou superior)
3. Conta na **OpenAI** com chave de API válida

## Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL para o projeto:
   ```sql
   CREATE DATABASE audit_checklist_db;
   ```

2. Crie um usuário e conceda privilégios (opcional, você pode usar um usuário existente):
   ```sql
   CREATE USER audit_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE audit_checklist_db TO audit_user;
   ```

## Configuração do Projeto

1. Clone o repositório (se ainda não o fez)

2. Navegue até a pasta do projeto:
   ```bash
   cd backend_tde
   ```

3. Copie o arquivo de ambiente de exemplo:
   ```bash
   copy .env.example .env
   ```

4. Edite o arquivo `.env` e configure as seguintes variáveis:
   - `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL
   - `JWT_SECRET`: Chave secreta para assinar tokens JWT (use uma string aleatória segura)
   - `OPENAI_API_KEY`: Sua chave de API da OpenAI

   Exemplo:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/audit_checklist_db?schema=public"
   JWT_SECRET=seu_segredo_jwt_super_seguro
   JWT_EXPIRES_IN=24h
   OPENAI_API_KEY=sk-sua_chave_da_api_openai
   ```

## Instalação e Inicialização

### Método Rápido (Recomendado)

Utilize o script de setup que realiza todas as etapas necessárias:

```bash
npm run setup
```

Este comando:
1. Instala todas as dependências
2. Gera o cliente Prisma
3. Executa as migrações do banco de dados
4. Popula o banco com dados iniciais

### Método Manual

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Gere o cliente Prisma:
   ```bash
   npm run prisma:generate
   ```

3. Execute as migrações do banco de dados:
   ```bash
   npm run prisma:migrate
   ```

4. Popule o banco com dados iniciais:
   ```bash
   npm run prisma:seed
   ```

## Execução

### Ambiente de Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento com recarga automática:

```bash
npm run dev
```

### Ambiente de Produção

Para iniciar o servidor em modo de produção:

```bash
npm start
```

## Verificação

1. Verifique se o servidor está rodando acessando:
   ```
   http://localhost:3000/api
   ```

2. Você pode testar a API usando as credenciais de usuário criadas pelo seed:
   - Email: `admin@example.com`
   - Senha: `admin123`

## Ferramentas Adicionais

### Visualização do Banco de Dados

Para abrir o Prisma Studio (interface visual para o banco de dados):

```bash
npm run prisma:studio
```

O Prisma Studio estará disponível em `http://localhost:5555`

### Lint

Para verificar o código com ESLint:

```bash
npm run lint
```

Para corrigir automaticamente problemas de lint:

```bash
npm run lint:fix
```

## Solução de Problemas

Se encontrar erros durante a configuração ou execução, verifique:

1. **Erro de conexão com o banco de dados**:
   - Verifique se o PostgreSQL está rodando
   - Verifique se a URL do banco no arquivo `.env` está correta
   - Certifique-se de que o usuário tem permissões adequadas

2. **Erro na API da OpenAI**:
   - Verifique se a chave da API é válida
   - Verifique se há créditos disponíveis na sua conta OpenAI

3. **Erro "Cannot find module"**:
   - Execute `npm install` novamente para garantir que todas as dependências estão instaladas

4. **Erro nas migrações do Prisma**:
   - Tente executar `npx prisma migrate reset` para redefinir o banco de dados (CUIDADO: isso apaga todos os dados)