# API Documentation

Este documento fornece exemplos detalhados de uso da API do sistema de auditoria com checklists baseados em IA.

## Base URL

```
http://localhost:3000/api
```

## Autenticação

Todas as rotas (exceto registro e login) requerem autenticação via token JWT no header:

```
Authorization: Bearer <seu_token_jwt>
```

## Endpoints

### Autenticação

#### Registro de Usuário

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Auditor Exemplo",
  "email": "auditor@exemplo.com",
  "password": "senha123"
}
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Auditor Exemplo",
      "email": "auditor@exemplo.com",
      "createdAt": "2023-10-15T14:30:00.000Z",
      "updatedAt": "2023-10-15T14:30:00.000Z"
    }
  },
  "message": "Usuário registrado com sucesso"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "auditor@exemplo.com",
  "password": "senha123"
}
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Auditor Exemplo",
      "email": "auditor@exemplo.com",
      "createdAt": "2023-10-15T14:30:00.000Z",
      "updatedAt": "2023-10-15T14:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login realizado com sucesso"
}
```

### Documentos

#### Upload de Documento

```http
POST /documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- document: <arquivo>
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "document": {
      "id": "uuid",
      "fileName": "plano_projeto.pdf",
      "filePath": "src/uploads/document-123456789.pdf",
      "fileType": "pdf",
      "userId": "uuid",
      "createdAt": "2023-10-15T15:00:00.000Z",
      "updatedAt": "2023-10-15T15:00:00.000Z"
    }
  },
  "message": "Documento enviado com sucesso"
}
```

#### Listar Documentos

```http
GET /documents
Authorization: Bearer <token>
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "documents": [
      {
        "id": "uuid",
        "fileName": "plano_projeto.pdf",
        "filePath": "src/uploads/document-123456789.pdf",
        "fileType": "pdf",
        "userId": "uuid",
        "createdAt": "2023-10-15T15:00:00.000Z",
        "updatedAt": "2023-10-15T15:00:00.000Z"
      }
    ]
  },
  "message": "Documentos recuperados com sucesso"
}
```

### Checklists

#### Criar Checklist

```http
POST /checklists/create/document_uuid
Content-Type: application/json
Authorization: Bearer <token>

{
  "standard": "ISO 9001"
}
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "checklist": {
      "id": "uuid",
      "standard": "ISO 9001",
      "userId": "uuid",
      "documentId": "uuid",
      "createdAt": "2023-10-15T15:30:00.000Z",
      "updatedAt": "2023-10-15T15:30:00.000Z",
      "questions": [
        {
          "id": "uuid",
          "text": "O documento possui uma política de qualidade definida?",
          "checklistId": "uuid"
        },
        // ... mais perguntas
      ]
    }
  },
  "message": "Checklist criado com sucesso"
}
```

#### Obter Checklist

```http
GET /checklists/checklist_uuid
Authorization: Bearer <token>
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "checklist": {
      "id": "uuid",
      "standard": "ISO 9001",
      "userId": "uuid",
      "documentId": "uuid",
      "createdAt": "2023-10-15T15:30:00.000Z",
      "updatedAt": "2023-10-15T15:30:00.000Z",
      "document": {
        "id": "uuid",
        "fileName": "plano_projeto.pdf"
      },
      "questions": [
        {
          "id": "uuid",
          "text": "O documento possui uma política de qualidade definida?",
          "answer": null
        },
        // ... mais perguntas
      ]
    }
  },
  "message": "Checklist recuperado com sucesso"
}
```

### Respostas

#### Responder Perguntas

```http
POST /answers/checklist_uuid
Content-Type: application/json
Authorization: Bearer <token>

{
  "answers": [
    {
      "questionId": "question_uuid",
      "response": true
    },
    {
      "questionId": "question_uuid_2",
      "response": false
    }
    // ... mais respostas
  ]
}
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "savedAnswers": [
      {
        "id": "uuid",
        "response": true,
        "questionId": "question_uuid",
        "createdAt": "2023-10-15T16:00:00.000Z",
        "updatedAt": "2023-10-15T16:00:00.000Z"
      },
      {
        "id": "uuid",
        "response": false,
        "questionId": "question_uuid_2",
        "createdAt": "2023-10-15T16:00:00.000Z",
        "updatedAt": "2023-10-15T16:00:00.000Z"
      }
    ],
    "nonConformities": [
      {
        "id": "uuid",
        "status": "OPEN",
        "checklistId": "checklist_uuid",
        "questionId": "question_uuid_2",
        "description": null,
        "observation": null,
        "createdAt": "2023-10-15T16:00:00.000Z",
        "updatedAt": "2023-10-15T16:00:00.000Z"
      }
    ]
  },
  "message": "Respostas salvas com sucesso"
}
```

### Não Conformidades

#### Listar Não Conformidades

```http
GET /nonconformities/checklist_uuid
Authorization: Bearer <token>
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "nonConformities": [
      {
        "id": "uuid",
        "status": "OPEN",
        "checklistId": "checklist_uuid",
        "questionId": "question_uuid",
        "description": null,
        "observation": null,
        "createdAt": "2023-10-15T16:00:00.000Z",
        "updatedAt": "2023-10-15T16:00:00.000Z",
        "question": {
          "id": "question_uuid",
          "text": "O documento possui uma política de qualidade definida?"
        }
      }
    ]
  },
  "message": "Não conformidades recuperadas com sucesso"
}
```

#### Atualizar Não Conformidade

```http
PUT /nonconformities/nonconformity_uuid
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "IN_PROGRESS",
  "description": "Falta definir a política de qualidade no documento",
  "observation": "Reunião agendada para definir a política"
}
```

Resposta:

```json
{
  "status": "success",
  "data": {
    "nonConformity": {
      "id": "uuid",
      "status": "IN_PROGRESS",
      "checklistId": "checklist_uuid",
      "questionId": "question_uuid",
      "description": "Falta definir a política de qualidade no documento",
      "observation": "Reunião agendada para definir a política",
      "createdAt": "2023-10-15T16:00:00.000Z",
      "updatedAt": "2023-10-15T16:30:00.000Z",
      "question": {
        "id": "question_uuid",
        "text": "O documento possui uma política de qualidade definida?"
      }
    }
  },
  "message": "Não conformidade atualizada com sucesso"
}
```

### Relatórios

#### Gerar Relatório PDF

```http
GET /reports/checklist_uuid/pdf
Authorization: Bearer <token>
```

Resposta: Arquivo PDF para download