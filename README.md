# 💳 Multi-Gateway Payment API

API RESTful desenvolvida em **Node.js (v24)** e **AdonisJS (v6)**, projetada para atuar como um **motor gerenciador de pagamentos multi-gateway**.

O sistema processa transações de compra com cartão de crédito e implementa um motor de **Fallback inteligente**: caso o gateway primário (de maior prioridade) recuse a transação ou fique indisponível, o sistema tenta automaticamente o próximo gateway da fila. O objetivo é garantir uma alta taxa de aprovação sem que o usuário final perceba a falha.

---

## 📑 Sumário

- [Visão Geral e Arquitetura](#️-visão-geral-e-arquitetura)
- [Níveis de Implementação do Desafio](#-níveis-de-implementação-do-desafio)
- [Comparação: Enunciado vs Entrega](#-comparação-enunciado-vs-entrega)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Banco de Dados](#️-estrutura-do-banco-de-dados)
- [Como Executar (Docker)](#-como-executar-docker)
- [Endpoints Principais](#️-endpoints-principais)
- [Testes (TDD)](#-testes-tdd)
- [Dificuldades Encontradas e Melhorias Futuras](#-dificuldades-encontradas-e-melhorias-futuras)

---

## 🏛️ Visão Geral e Arquitetura

O projeto foi construído sob os pilares do **Clean Code** e **Princípios SOLID**.
A comunicação com os provedores de pagamento foi isolada utilizando os Design Patterns **Adapter** e **Factory**, garantindo que a aplicação central não conheça os detalhes HTTP de terceiros.

- **Camada de Casos de Uso (`UseCases`)**: Regras de negócio puras, sem conhecimento do mundo web.
- **Camada de Integração (`Adapters`)**: Padroniza as respostas de APIs distintas (Gateway 1 em inglês vs Gateway 2 em português) sob um único contrato (`PaymentGatewayContracts`).
- **Injeção de Dependências**: Facilita a criação de testes automatizados e o baixo acoplamento.

---

## 🚀 Níveis de Implementação do Desafio

O projeto foi estruturado com o foco em atingir a maturidade máxima proposta (**Nível 3**). Como os níveis são progressivos, as regras do Nível 3 sobrepõem as iniciais.

| Nível       | Status           | Requisitos Atendidos                                                                                                                                                 |
| ----------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nível 1** | ✅ **Concluído** | API estruturada com banco de dados; tentativas em cadeia (fallback) implementadas e funcionais.                                                                      |
| **Nível 2** | ✅ **Concluído** | Autenticação implementada; comunicação com os Mocks de Gateways utilizando autenticação (Bearer/Headers); carrinho processado via back-end.                          |
| **Nível 3** | ✅ **Concluído** | Múltiplos produtos calculados no backend; RBAC (Roles: `ADMIN`, `MANAGER`, `FINANCE`, `USER`); implementação via TDD; ambiente 100% conteinerizado (Docker Compose). |

---

## 📊 Comparação: Enunciado vs Entrega

> A tabela abaixo é uma leitura **objetiva** dos requisitos do enunciado original contra o que está implementado no código, deixando claro o que ficou pendente.

| Requisito do enunciado              | Esperado | Entregue (Status) | Observações e Adaptações                                                                                                                                      |
| ----------------------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js (v24) + TypeScript**      | Sim      | ✅ **Sim**        | Runtime e tipagem estrita aplicados em todo o projeto.                                                                                                        |
| **Framework AdonisJS 6+**           | Sim      | ✅ **Sim**        | Utilizada a versão **AdonisJS 6**, a mais recente e performática.                                                                                             |
| **Clean Code e SOLID**              | Sim      | ✅ **Sim**        | Controllers enxutos, SRP nos UseCases e Injeção de Dependência.                                                                                               |
| **Design Patterns**                 | Sim      | ✅ **Sim**        | `Adapter`, `Factory` e `Strategy` aplicados na orquestração dos gateways.                                                                                     |
| **Banco de Dados MySQL**            | Sim      | ✅ **Sim**        | Subido e orquestrado via Docker Compose.                                                                                                                      |
| **ORM e Migrations**                | Sim      | ✅ **Sim**        | Utilizado o `Lucid ORM` nativo do Adonis.                                                                                                                     |
| **Validação de Dados**              | Sim      | ✅ **Sim**        | Validação estrita de _payloads_ utilizando `VineJS`.                                                                                                          |
| **Respostas em JSON**               | Sim      | ✅ **Sim**        | API responde exclusivamente em formato JSON.                                                                                                                  |
| **Log na Aplicação**                | Sim      | ✅ **Sim**        | Logger nativo (`@adonisjs/core/services/logger`) rastreando falhas e fallback.                                                                                |
| **Implementar TDD**                 | Sim      | ✅ **Sim**        | Testes funcionais (com cobertura parcial) desenvolvidos com o framework `Japa`.                                                                               |
| **Docker Compose Completo**         | Sim      | ✅ **Sim**        | App + MySQL + Mocks (3001 e 3002) rodando de forma integrada.                                                                                                 |
| **Estrutura de Tabelas Exata**      | Sim      | ⚠️ **Parcial**    | As entidades `clients` e `users` foram **unificadas** na tabela `users` (Role: `USER`) para evitar redundância de dados e seguir o princípio DRY.             |
| **Detalhe de um cliente / compras** | Sim      | ⚠️ **Parcial**    | É possível listar compras por usuário via listagem geral (`/transactions`), mas uma rota aninhada específica (`/clients/:id/transactions`) não foi declarada. |
| **Swagger / Documentação da API**   | Sim      | ❌ **Não**        | A documentação interativa OpenAPI não foi gerada a tempo.                                                                                                     |

---

## 🗄️ Estrutura do Banco de Dados

A modelagem final implementada contém:

- **`users`**: Centraliza clientes e staff. Campos: id, email, password, role (`ADMIN`, `MANAGER`, `FINANCE`, `USER`).
- **`gateways`**: Provedores de pagamento. Campos: id, name, is_active, priority.
- **`products`**: Catálogo de venda. Campos: id, name, amount (em centavos).
- **`transactions`**: Histórico financeiro. Campos: id, user_id, gateway_id, gateway_transaction_id, amount, status (`PAID`, `REFUNDED`, `FAILED`), card_last_digits.
- **`transaction_products`**: Tabela pivô para guardar o histórico de itens comprados no carrinho.

---

## 🐳 Como Executar (Docker)

O ambiente foi preparado para rodar "out of the box" através do Docker.

### Pré-requisitos

- **Docker** e **Docker Compose** instalados.
- Portas disponíveis: `3333` (API), `3306` (MySQL), `3001` (Gateway 1) e `3002` (Gateway 2).

### Passos:

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>

```

2. Crie o arquivo de configuração de ambiente:

```bash
cp .env.example .env

```

3. Suba a infraestrutura:

```bash
docker-compose up --build -d

```

4. Execute as migrations e popule o banco inicial (Seeds):

```bash
docker exec -it <nome-do-container-app> node ace migration:run
docker exec -it <nome-do-container-app> node ace db:seed

```

A API estará disponível em: `http://localhost:3333/api`

---

## 🛣️ Endpoints Principais

A API utiliza autenticação via `Bearer Token` (Opaque Access Token).

### Públicas

- `POST /api/login` - Gera o token de acesso.
- `POST /api/signup` - Criação de conta cliente (Ganha a role `USER` automaticamente).

### Rotas Privadas

**Acesso: USER (Clientes)**

- `POST /api/checkout` - Realiza a compra. Aciona o motor de fallback e salva a transação.
- `GET /api/transactions` - Lista as compras do usuário logado.

**Acesso: MANAGER e ADMIN**

- `GET, PATCH, DELETE /api/users` - CRUD e gestão da equipe/clientes (ex: promover um usuário a `FINANCE`).

**Acesso: FINANCE, MANAGER e ADMIN**

- `POST, PATCH, DELETE /api/products` - CRUD do catálogo de produtos.
- `GET /api/transactions/all` - Lista as compras de todos os clientes.
- `GET /api/transactions/:id` - Detalha uma transação específica.

**Acesso Exclusivo: FINANCE e ADMIN**

- `POST /api/transactions/:id/refund` - Aciona a API do gateway via Docker para **estorno real** da compra.

**Acesso Exclusivo: ADMIN**

- `GET /api/gateways` - Lista os provedores.
- `PATCH /api/gateways/:id/toggle` - Ativa/Desativa um gateway.
- `PATCH /api/gateways/priority` - Altera a ordem de roteamento de pagamentos.

---

## 🧪 Testes (TDD)

O projeto foi construído orientado a testes, garantindo a resiliência do motor de pagamentos e a segurança das rotas (RoleMiddlewares).

Para executar a suíte de testes (com os containers rodando):

```bash
docker exec -it <nome-do-container-app> node ace test

```

---

## 🚧 Dificuldades Encontradas e Melhorias Futuras

### Dificuldades

1. **Padronização das APIs de Terceiros:** O Gateway 1 exigia um _handshake_ inicial (Login) e payload em inglês, enquanto o Gateway 2 usava _Custom Headers_ estáticos e payload em português. A dificuldade foi abstrair comportamentos tão distintos em uma única interface limpa sem sujar os Casos de Uso. O uso do padrão **Adapter** resolveu isso brilhantemente.
2. **Tipagem Estrita com `fetch`:** Como optou-se por não usar `axios` para reduzir dependências, lidar com os retornos `unknown` da API nativa `fetch` exigiu mapeamentos (Type Assertions) cuidadosos para evitar falhas em tempo de execução.

### O que ficou pendente / Melhorias

- **Swagger:** A documentação interativa via OpenAPI estava no roadmap, mas não foi implementada a tempo.
- **CI/CD Pipeline:** Adicionar GitHub Actions para rodar a suíte do `Japa` e o Linter de forma automatizada em cada PR.
- **Isolamento de Tabelas (Clients):** Embora a decisão arquitetural de unificar `clients` e `users` tenha reduzido a complexidade, em um sistema real com distinção forte de domínios, separar os dados de perfil do cliente em uma tabela própria poderia ser benéfico.
- **Rotas de Relatórios (CRM):** Detalhar relatórios de compras aninhados diretamente a um cliente (`/api/clients/:id/purchases`) otimizaria o trabalho do Front-end administrativo.
