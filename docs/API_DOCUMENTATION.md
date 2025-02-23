# Documentação da API de Agendamento

## Índice
1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Estrutura das Tabelas](#estrutura-das-tabelas)
4. [Endpoints](#endpoints)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Códigos de Erro](#códigos-de-erro)

## Introdução

A API de Agendamento é um serviço RESTful que permite gerenciar empresas, clientes, atendentes e agendamentos. Todas as respostas são em formato JSON.

**URL Base**: A URL base será o endereço onde esta documentação está sendo acessada.

## Autenticação

A API utiliza autenticação via chave API (API Key). Para todas as requisições (exceto criação de empresa), você deve incluir o header:

```
x-api-key: [A chave API será carregada automaticamente do ambiente]
```

> **Nota**: A chave API mostrada nesta documentação é carregada dinamicamente do ambiente onde a API está rodando. Ela será atualizada automaticamente se o valor for alterado no arquivo de configuração.

## Estrutura das Tabelas

### Empresas (empresas)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | TEXT | Nome da empresa (obrigatório) |
| atividade | TEXT | Ramo de atividade (obrigatório) |
| responsavel | TEXT | Nome do responsável (obrigatório) |
| endereco_rua | TEXT | Rua do endereço |
| endereco_cidade | TEXT | Cidade do endereço |
| endereco_estado | TEXT | Estado do endereço |
| endereco_bairro | TEXT | Bairro do endereço |
| endereco_cep | TEXT | CEP do endereço |
| endereco_pais | TEXT | País do endereço |
| endereco_complemento | TEXT | Complemento do endereço |
| endereco_numero | TEXT | Número do endereço |
| telefone_fixo | TEXT | Telefone fixo |
| telefone_celular | TEXT | Telefone celular |
| email | TEXT | Email da empresa |
| logo | TEXT | URL da logo da empresa |
| ativa | BOOLEAN | Status da empresa (default: true) |
| data_cadastro | TIMESTAMP WITH TIME ZONE | Data de cadastro (default: CURRENT_TIMESTAMP) |
| chave_api | UUID | Chave de API (default: UUID zero) |

### Clientes (clientes)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | VARCHAR(150) | Nome do cliente (obrigatório) |
| cpf_cnpj | VARCHAR(20) | CPF ou CNPJ do cliente (único) |
| data_nascimento | DATE | Data de nascimento |
| telefone_celular | TEXT | Telefone de contato (obrigatório) |
| email | VARCHAR(255) | Email do cliente (único) |
| endereco_rua | TEXT | Rua do endereço |
| endereco_cidade | TEXT | Cidade do endereço |
| endereco_estado | TEXT | Estado do endereço |
| endereco_bairro | TEXT | Bairro do endereço |
| endereco_cep | TEXT | CEP do endereço |
| endereco_pais | TEXT | País do endereço |
| endereco_complemento | TEXT | Complemento do endereço |
| endereco_numero | TEXT | Número do endereço |
| observacoes | TEXT | Observações gerais |
| data_cadastro | TIMESTAMP WITH TIME ZONE | Data de cadastro (default: CURRENT_TIMESTAMP) |
| senha | TEXT | Senha do cliente (obrigatório) |
| ativo | BOOLEAN | Status do cliente (default: true) |
| empresa_id | UUID | ID da empresa (obrigatório) |

### Atendentes (atendentes)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | VARCHAR(100) | Nome do atendente (obrigatório) |
| especialidade_id | UUID | ID da especialidade (obrigatório) |
| empresa_id | UUID | ID da empresa (obrigatório) |
| telefone_celular | TEXT | Telefone de contato (obrigatório) |
| email | VARCHAR(255) | Email do atendente (obrigatório) |
| data_contratacao | TIMESTAMP WITH TIME ZONE | Data de contratação (obrigatório) |
| administrador | BOOLEAN | Se é administrador (default: false) |
| ativo | BOOLEAN | Status do atendente (default: true) |

### Especialidades (especialidades)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | TEXT | Nome da especialidade (obrigatório) |
| descricao | TEXT | Descrição da especialidade (obrigatório) |
| empresa_id | UUID | ID da empresa (obrigatório) |

### Horários (horarios)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| atendente_id | UUID | ID do atendente (obrigatório) |
| dia_semana | INTEGER | Dia da semana (0-6) (obrigatório) |
| hora_inicio | TIME | Horário de início (obrigatório) |
| hora_fim | TIME | Horário de término (obrigatório) |
| ativo | BOOLEAN | Status do horário (default: true) |
| empresa_id | UUID | ID da empresa (obrigatório) |

### Agendamentos (agendamentos)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| cliente_id | UUID | ID do cliente (obrigatório) |
| empresa_id | UUID | ID da empresa (obrigatório) |
| atendente_id | UUID | ID do atendente (obrigatório) |
| data_agendamento | TIMESTAMP WITH TIME ZONE | Data e hora do agendamento (obrigatório) |
| status | ENUM | Status ('confirmado', 'cancelado', 'concluido') |
| observacoes | TEXT | Observações do agendamento |

## Endpoints

### Empresas

#### Criar Empresa
```http
POST /empresas
```

Corpo da Requisição:
```json
{
  "nome": "Minha Empresa",
  "atividade": "Barbearia",
  "responsavel": "João Silva",
  "telefone_celular": "11999999999"
}
```

### Clientes

#### Criar Cliente
```http
POST /clientes
```

Corpo da Requisição:
```json
{
  "nome": "Cliente Exemplo",
  "cpf_cnpj": "123.456.789-00",
  "data_nascimento": "1990-01-01",
  "telefone_celular": "11999999999",
  "email": "cliente@email.com",
  "endereco_rua": "Rua do Cliente",
  "endereco_cidade": "São Paulo",
  "endereco_estado": "SP",
  "endereco_bairro": "Centro",
  "endereco_cep": "01001-001",
  "endereco_pais": "Brasil",
  "endereco_complemento": "Apto 123",
  "endereco_numero": "456",
  "observacoes": "Observações sobre o cliente",
  "senha": "senha123",
  "ativo": true
}
```

### Atendentes

#### Criar Atendente
```http
POST /atendentes
```

Corpo da Requisição:
```json
{
  "nome": "Atendente Exemplo",
  "telefone_celular": "11999999999",
  "email": "atendente@email.com",
  "data_contratacao": "2025-02-22",
  "especialidade_id": 1
}
```

### Especialidades

#### Criar Especialidade
```http
POST /especialidades
```

Corpo da Requisição:
```json
{
  "nome": "Corte de Cabelo",
  "descricao": "Corte masculino ou feminino"
}
```

### Horários

#### Criar Horário
```http
POST /horarios
```

Corpo da Requisição:
```json
{
  "dia_semana": 1,
  "hora_inicio": "09:00",
  "hora_fim": "10:00",
  "atendente_id": 1
}
```

### Agendamentos

#### Criar Agendamento
```http
POST /agendamentos
```

Corpo da Requisição:
```json
{
  "data": "2025-02-22",
  "cliente_id": 1,
  "atendente_id": 1,
  "horario_id": 1,
  "observacoes": "Observações sobre o agendamento"
}
```

## Exemplos de Uso

### Criar Empresa (não requer API key)
```http
POST /empresas
Content-Type: application/json

{
  "nome": "Minha Empresa",
  "atividade": "Barbearia",
  "responsavel": "João Silva",
  "telefone_celular": "11999999999"
}
```

Resposta de sucesso:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Minha Empresa",
  "chave_api": "446AE6DD89E64F7F9D8964B595035644"
}
```

### Criar Cliente (requer API key)
```http
POST /clientes
Content-Type: application/json
x-api-key: [A chave API será carregada automaticamente do ambiente]

{
  "nome": "Cliente Exemplo",
  "cpf_cnpj": "123.456.789-00",
  "telefone_celular": "11999999999",
  "email": "cliente@email.com",
  "senha": "senha123"
}
```

### Listar Clientes (requer API key)
```http
GET /clientes
x-api-key: [A chave API será carregada automaticamente do ambiente]
```

### Criar Atendente (requer API key)
```http
POST /atendentes
Content-Type: application/json
x-api-key: [A chave API será carregada automaticamente do ambiente]

{
  "nome": "Atendente Exemplo",
  "especialidade_id": "550e8400-e29b-41d4-a716-446655440000",
  "telefone_celular": "11999999999",
  "email": "atendente@email.com",
  "data_contratacao": "2025-02-22T00:00:00.000Z"
}
```

### Criar Horário (requer API key)
```http
POST /horarios
Content-Type: application/json
x-api-key: [A chave API será carregada automaticamente do ambiente]

{
  "atendente_id": "550e8400-e29b-41d4-a716-446655440000",
  "dia_semana": 1,
  "hora_inicio": "09:00",
  "hora_fim": "18:00"
}
```

### Criar Agendamento (requer API key)
```http
POST /agendamentos
Content-Type: application/json
x-api-key: [A chave API será carregada automaticamente do ambiente]

{
  "cliente_id": "550e8400-e29b-41d4-a716-446655440000",
  "atendente_id": "550e8400-e29b-41d4-a716-446655440001",
  "data_agendamento": "2025-02-22T14:00:00.000Z"
}
```

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Requisição inválida |
| 401 | Não autorizado - Chave API inválida |
| 404 | Recurso não encontrado |
| 409 | Conflito - Ex: Horário já agendado |
| 500 | Erro interno do servidor |

Exemplo de erro:
```json
{
  "error": "Mensagem de erro detalhada"
}
