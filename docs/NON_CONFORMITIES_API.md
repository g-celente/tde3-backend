# Documentação da API - Não Conformidades Avançadas

Esta documentação descreve os novos endpoints implementados para gerenciamento avançado de não conformidades.

## Novos Endpoints Implementados

### 1. Detalhes de Não Conformidade

**Endpoint:** `GET /api/nonconformities/details/:id`

**Descrição:** Busca detalhes completos de uma não conformidade específica, incluindo ações corretivas.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "data": {
    "nonConformity": {
      "id": "uuid",
      "status": "OPEN",
      "description": "Descrição da não conformidade",
      "observation": "Observações gerais",
      "resolvedAt": null,
      "createdAt": "2023-10-15T16:00:00.000Z",
      "updatedAt": "2023-10-15T16:00:00.000Z",
      "question": {
        "id": "uuid",
        "text": "O documento possui uma política de qualidade definida?"
      },
      "checklist": {
        "id": "uuid",
        "standard": "ISO 9001",
        "document": {
          "id": "uuid",
          "fileName": "plano_projeto.pdf"
        }
      },
      "correctiveActions": [
        {
          "id": "uuid",
          "action": "Definir política de qualidade no documento",
          "createdAt": "2023-10-15T17:00:00.000Z"
        }
      ]
    }
  },
  "message": "Detalhes da não conformidade recuperados com sucesso"
}
```

### 2. Adicionar Ação Corretiva

**Endpoint:** `POST /api/nonconformities/:id/corrective-action`

**Descrição:** Adiciona uma ação corretiva a uma não conformidade.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "action": "Descrição da ação corretiva a ser implementada"
}
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "data": {
    "correctiveAction": {
      "id": "uuid",
      "action": "Descrição da ação corretiva a ser implementada",
      "createdAt": "2023-10-15T17:00:00.000Z",
      "nonConformityId": "uuid"
    }
  },
  "message": "Ação corretiva adicionada com sucesso"
}
```

### 3. Concluir Não Conformidade

**Endpoint:** `PUT /api/nonconformities/:id/resolve`

**Descrição:** Marca uma não conformidade como resolvida.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "conclusion": "Descrição da conclusão e resolução da não conformidade"
}
```

**Resposta de Sucesso:**
```json
{
  "status": "success",
  "data": {
    "nonConformity": {
      "id": "uuid",
      "status": "RESOLVED",
      "description": "Descrição da não conformidade",
      "observation": "Descrição da conclusão e resolução da não conformidade",
      "resolvedAt": "2023-10-15T18:00:00.000Z",
      "createdAt": "2023-10-15T16:00:00.000Z",
      "updatedAt": "2023-10-15T18:00:00.000Z",
      "question": {
        "id": "uuid",
        "text": "O documento possui uma política de qualidade definida?"
      },
      "correctiveActions": [
        {
          "id": "uuid",
          "action": "Definir política de qualidade no documento",
          "createdAt": "2023-10-15T17:00:00.000Z"
        }
      ]
    }
  },
  "message": "Não conformidade concluída com sucesso"
}
```

### 4. Relatório de Não Conformidades em PDF

**Endpoint:** `GET /api/reports/:checklistId/nonconformities/pdf`

**Descrição:** Gera um relatório detalhado em PDF focado especificamente nas não conformidades de um checklist.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta:** Download direto do arquivo PDF

**Conteúdo do Relatório:**
- Resumo estatístico das não conformidades
- Status das não conformidades (Abertas, Em Andamento, Resolvidas)
- Detalhes de cada não conformidade
- Ações corretivas implementadas
- Observações e conclusões

## Status das Não Conformidades

- **OPEN**: Não conformidade identificada, aguardando ações
- **IN_PROGRESS**: Ações corretivas em andamento
- **RESOLVED**: Não conformidade resolvida

## Validações

### Ação Corretiva:
- Campo `action` é obrigatório
- Deve ter pelo menos 10 caracteres
- Deve ser uma string válida

### Conclusão:
- Campo `conclusion` é obrigatório
- Deve ter pelo menos 10 caracteres
- Deve ser uma string válida

## Fluxo de Trabalho Recomendado

1. **Identificação**: Não conformidades são automaticamente criadas quando uma pergunta é respondida com "Não"
2. **Análise**: Use `GET /api/nonconformities/details/:id` para analisar detalhes
3. **Ação**: Use `POST /api/nonconformities/:id/corrective-action` para documentar ações corretivas
4. **Acompanhamento**: Adicione múltiplas ações conforme necessário
5. **Resolução**: Use `PUT /api/nonconformities/:id/resolve` para marcar como resolvida
6. **Relatório**: Use `GET /api/reports/:checklistId/nonconformities/pdf` para gerar relatório final

## Exemplos de Uso

### Obter detalhes de uma não conformidade:
```bash
curl -X GET \
  http://localhost:3000/api/nonconformities/details/uuid-da-nao-conformidade \
  -H 'Authorization: Bearer seu-jwt-token'
```

### Adicionar ação corretiva:
```bash
curl -X POST \
  http://localhost:3000/api/nonconformities/uuid-da-nao-conformidade/corrective-action \
  -H 'Authorization: Bearer seu-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "Revisar e atualizar a política de qualidade conforme ISO 9001"
  }'
```

### Resolver não conformidade:
```bash
curl -X PUT \
  http://localhost:3000/api/nonconformities/uuid-da-nao-conformidade/resolve \
  -H 'Authorization: Bearer seu-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "conclusion": "Política de qualidade foi definida e aprovada pela equipe técnica"
  }'
```

### Gerar relatório de não conformidades:
```bash
curl -X GET \
  http://localhost:3000/api/reports/uuid-do-checklist/nonconformities/pdf \
  -H 'Authorization: Bearer seu-jwt-token' \
  --output relatorio-nao-conformidades.pdf
```