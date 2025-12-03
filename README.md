# AgrOmie ERP Rural

> Sistema de gestão integrado e simplificado para pequenas propriedades rurais, especialmente focado em pecuária de corte.

## 🎯 Visão do Projeto

O AgrOmie é um app de gestão rural simplificada para pequenos produtores rurais. A **proposta de valor** é trazer **praticidade e IA** para este processo, permitindo que o produtor gerencie toda a fazenda através de linguagem natural, sem necessidade de entender ERP ou números complexos.

### Problema que Resolve

- ❌ **Antes**: Gestão manual com papel e caneta, difícil acompanhar lucro, despesas, crescimento do rebanho e eficiência das pastagens
- ✅ **Depois**: Sistema integrado que automatiza 80-90% da gestão, operado por voz/texto via agente de IA

### Proposta de Valor

No centro de tudo: **um agente de IA que coordena UX e interpreta o relato do manejo** para organizar o banco de dados - registrar movimentações de estoque, financeiras, entender nuances, enfim... auxiliar o gestor muitas vezes inexperiente a conseguir organizar a casa da empresa.

## 📊 Estado Atual do Projeto

### Onde Estamos Hoje

O AgrOmie está em **fase de MVP funcional** com todas as entregas principais implementadas:

#### ✅ Entregas do MVP Concluídas

1. **Dashboard Interativa**
   - Dashboard que puxa dados dos módulos
   - KPIs em tempo real (Financeiro, Rebanho, Pastagens)
   - Interface de chat integrada
   - Painéis recolhíveis para melhor organização

2. **Módulo Financeiro**
   - Registro de movimentações (receitas, despesas, investimentos, retiradas)
   - Integração com módulo pecuário (compras/vendas de animais)
   - Integração com módulo de pastagem (custos de manutenção/formação)
   - Custo de operação calculado automaticamente
   - KPIs próprias (margens, fluxo de caixa)

3. **Módulo Pecuário**
   - Registro de compra/venda (integrada ao financeiro)
   - Balanço patrimonial do rebanho
   - Distribuição nas pastagens (integração com módulo de pastagem)
   - Nascimentos e mortes
   - KPIs (GMD, custo por @, taxas de natalidade/mortalidade/desfrute)

4. **Módulo Pastagem**
   - Registro de movimentações de estoque (integração módulo pecuário)
   - Custos de manutenção e investimentos (módulo financeiro)
   - KPIs próprias (taxa de lotação, UA/ha, balanço oferta vs demanda)
   - Status de lotação (IDEAL/SUBLOTADO/SUPERLOTADO)

5. **Agente de IA (Orchestrator)**
   - Coordena UX e interpreta relato do manejo
   - Organiza banco de dados automaticamente
   - Registra movimentações de estoque e financeiras
   - Entende nuances e auxilia gestores inexperientes
   - Arquitetura LLM-centered com function calling

### Distância da Visão de Produto

**Status**: ~85% da visão MVP implementada

**O que funciona:**
- ✅ Todos os módulos core funcionais
- ✅ Integrações automáticas entre módulos
- ✅ Agente de IA operacional com LLM-centered
- ✅ Dashboard com KPIs em tempo real
- ✅ Sistema de persistência (localStorage)

**O que falta para completar a visão:**
- ⚠️ **UI para navegação do agente**: O agente precisa de uma UI para navegar também (integração MCP Playwright planejada)
- ⚠️ **Associação direta de animais com pastos**: Atualmente usa distribuição proporcional
- ⚠️ **Backend real**: Atualmente usando localStorage (preparado para migração)
- ⚠️ **Autenticação real**: Atualmente mock (preparado para implementação)

**Próximos passos prioritários:**
1. Melhorar UI para navegação do agente
2. Integrar MCP Playwright para capacidades de navegação
3. Implementar associação direta animais ↔ pastos
4. Migrar para backend real quando necessário

## 🏗️ Arquitetura

O AgrOmie é composto por **quatro módulos centrais** que funcionam de forma integrada:

### 1. **Módulo Financeiro** (CORE)

Base econômica e contábil inspirada no Controlpec e CUSTObov da Embrapa.

**Funcionalidades:**
- Plano de contas configurável (Despesas, Receitas, Investimentos, Pró-labore)
- Lançamentos de receitas, despesas, investimentos e retiradas
- Consolidação mensal e anual
- Cálculo automático de margens (Bruta, Operacional, Líquida)
- Fluxo de caixa
- API para integração com outros módulos
- Integração automática com Rebanho (compras/vendas)
- Integração automática com Pastagens (manutenção/formação)

### 2. **Módulo do Rebanho**

Gestão zootécnica completa integrada ao financeiro.

**Funcionalidades:**
- Categorias zootécnicas (vacas, novilhas, bezerros, bois magros/gordos, etc.)
- Registro de nascimentos, mortes, compras, vendas, pesagens
- Cálculo automático de indicadores:
  - Estoque zootécnico
  - Valor patrimonial do rebanho
  - GMD (Ganho Médio Diário)
  - Taxas de natalidade, mortalidade e desfrute
- Integração automática com Financeiro (compras/vendas atualizam receitas/despesas)
- Integração com Pastagens (UA total atualiza lotação)

### 3. **Módulo de Pastagens**

Gerenciamento de uso, produtividade e custos das pastagens.

**Funcionalidades:**
- Registro de áreas de pasto e capacidade de suporte (UA/ha)
- Taxa de lotação
- Manejo de pastagens (formação, reforma, manutenção)
- Cálculo de balanço oferta vs demanda de forragem
- Integração com Rebanho (UA total atualiza lotação)
- Integração com Financeiro (manutenção → despesas, formação → investimentos)
- Busca de pastos por nome (fuzzy matching)
- Status de lotação (IDEAL/SUBLOTADO/SUPERLOTADO)

### 4. **Agente de IA Integrado (LLM-Centered)**

Operação por linguagem natural (texto/áudio) com arquitetura LLM-centered. O agente atua como **orchestrator** que coordena UX e interpreta o relato do manejo.

**Funcionalidades:**
- Interpretação de linguagem natural via LLM (OpenRouter/Gemini)
- Arquitetura LLM-centered com function calling
- Loop de raciocínio autônomo (múltiplas tool calls em sequência)
- Validação e correção automática
- Extração automática de entidades (data, categoria, quantidade, preço, pastos, etc.)
- Execução automática de ações em todos os módulos
- Base de conhecimento com nomenclaturas Embrapa
- Interface de chat dedicada (estilo ChatGPT)
- **Preparado para navegação UI** (integração MCP Playwright planejada)

**Tools Disponíveis:**
- `executeIntent` - Executar ações do sistema (principal)
- `queryStorage` / `mutateStorage` - Acessar dados do localStorage
- `readFile` / `writeFile` - Leitura/escrita de arquivos (preparado para backend)
- `log` - Registro de mensagens
- Outras tools para análise e validação

## 🔄 Arquitetura LLM-Centered

O sistema utiliza uma **arquitetura LLM-centered** onde o LLM tem controle total sobre o fluxo de execução:

### Componentes

- **Orchestrator**: Gerencia loop de raciocínio autônomo
- **LLM**: Controla o fluxo de execução via function calling
- **Tools**: Ferramentas expostas ao LLM para interagir com o sistema
- **Executor**: `executeAction()` do `ai-agent.ts` (usado como tool)

### Fluxo de Processamento

```
Usuário: "Comprei 100 bezerros por 120 mil reais"
  ↓
Orchestrator → LLM (com function calling)
  ↓
LLM decide chamar: executeIntent("registrar_compra_animais", {...})
  ↓
Tool executa → Registra compra no sistema + Investimento financeiro
  ↓
LLM valida resultado → Responde ao usuário
  ↓
Dashboard: Métricas atualizadas automaticamente
```

### Intents Suportados

**Financeiro:**
- `registrar_receita` - Registrar receita
- `registrar_despesa` - Registrar despesa
- `registrar_investimento` - Registrar investimento
- `registrar_pró_labore` - Registrar pró-labore

**Rebanho:**
- `registrar_compra_animais` - Registrar compra de animais
- `registrar_venda_animais` - Registrar venda de animais
- `registrar_nascimento` - Registrar nascimento
- `registrar_morte` - Registrar morte
- `registrar_pesagem` - Registrar pesagem
- `registrar_inventario_rebanho` - Registrar animais existentes (sem compra)
- `registrar_movimentação_rebanho` - Registrar movimentação interna

**Pastagens:**
- `registrar_area_pasto` - Registrar área de pasto
- `registrar_manejo_pasto` - Registrar manejo de pastagem

**Operações Complexas:**
- `operacao_complexa_rebanho` - Múltiplas pastagens + compra de animais + distribuição

**Consultas:**
- `consultar_financeiro` - Consultar dados financeiros
- `consultar_rebanho` - Consultar dados do rebanho
- `consultar_pastagens` - Consultar dados de pastagens
- `consultar_margens` - Consultar margens

**Sistema:**
- `limpar_cache` - Limpar cache
- `resetar_dados` - Resetar todos os dados
- `resetar_rebanho` - Resetar dados do rebanho
- `resetar_financeiro` - Resetar dados financeiros
- `resetar_pastagens` - Resetar dados de pastagens

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **shadcn/ui** + **Tailwind CSS** (UI components)
- **React Router** (roteamento)
- **React Hook Form** + **Zod** (formulários e validação)
- **TanStack Query** (caching e sincronização)
- **Fontes Premium**: Inter (primary), Manrope (display)

### Backend (Atual)
- **localStorage** (persistência temporária)
- Estrutura preparada para migração para backend real (REST API, banco de dados)
- Sistema de storage padronizado (`src/lib/storage.ts`)

### Backend (Planejado - Fase 5)
- **Node.js 20+** + **Express.js** (API REST)
- **PostgreSQL 15+** (banco de dados relacional)
- **Event-Sourcing** + **CQRS** (arquitetura de eventos imutáveis)
- **Materialized Views** (KPIs pré-calculados para performance)
- **JWT Authentication** (autenticação segura)
- **Multi-Tenancy** (suporte a múltiplas fazendas por usuário)
- **Drizzle ORM** (migrations e queries type-safe)

### IA
- **OpenRouter API** (integração com LLMs)
- **Google Gemini 2.0 Flash Lite** (modelo padrão)
- Arquitetura LLM-centered com function calling

### Autenticação (Atual)
- **Mock authentication** usando localStorage
- Estrutura preparada para autenticação real
- AuthContext implementado (`src/contexts/AuthContext.tsx`)

## 🏛️ Arquitetura Backend Planejada (Fase 5)

O AgrOmie está preparado para migração de localStorage para uma arquitetura backend robusta baseada em **Event-Sourcing** e **CQRS**, inspirada nas melhores práticas de sistemas escaláveis.

### Visão Geral da Arquitetura

```
Frontend (React) → API REST (Express) → PostgreSQL (Event Store + Projections)
                                       ↓
                                Event-Sourcing Layer
                                       ↓
                        Command Handlers + Query Handlers
                                       ↓
                        Materialized Views (KPIs otimizados)
```

### Princípios da Arquitetura

**Event-Sourcing**: Todas as operações (compras, vendas, nascimentos, despesas) geram eventos imutáveis que são armazenados permanentemente. O estado atual é reconstruído a partir desses eventos, permitindo:
- ✅ Auditoria total de todas as operações
- ✅ Histórico completo e rastreável
- ✅ Capacidade de "replay" de eventos
- ✅ Análise temporal de dados

**CQRS (Command Query Responsibility Segregation)**: Separação entre operações de escrita (commands) e leitura (queries):
- **Commands**: Criam eventos (ex: "CompraAnimalRegistrada")
- **Queries**: Consultam projeções otimizadas (ex: "ObterMetricasFinanceiras")
- **Projections**: Views materializadas construídas a partir dos eventos

### Estrutura do Banco de Dados

#### Tabelas Principais (Estado Atual)
- `users` - Usuários do sistema
- `farms` - Fazendas (multi-tenancy)
- `animals` - Animais individuais
- `pastures` - Áreas de pastagem
- `transactions` - Transações financeiras
- `accounts_plan` - Plano de contas

#### Event Store (Eventos Imutáveis)
- `livestock_events` - Eventos do rebanho (compra, venda, nascimento, morte, pesagem)
- `financial_events` - Eventos financeiros (receitas, despesas, investimentos)
- `pasture_events` - Eventos de pastagens (formação, reforma, manutenção)

#### Materialized Views (Performance)
- `kpi_financial_monthly` - KPIs financeiros pré-calculados
- `kpi_livestock_monthly` - KPIs do rebanho pré-calculados
- `kpi_pasture_monthly` - KPIs de pastagens pré-calculados

### Benefícios para o Orchestrator (LLM-Centered)

A arquitetura Event-Sourcing é ideal para o agente de IA:
- ✅ **Atomicidade**: Múltiplas tool calls em sequência são seguras
- ✅ **Consistência**: Eventos garantem integridade dos dados
- ✅ **Auditoria**: Todas as ações do agente são rastreáveis
- ✅ **Performance**: Projeções otimizadas para consultas rápidas
- ✅ **Rollback**: Possibilidade de reverter operações se necessário

### Dashboard Otimizado

Com materialized views, o dashboard será **10x mais rápido**:
- **Antes**: Cálculos em tempo real a cada render (500-1000ms)
- **Depois**: Consulta direta em views pré-calculadas (<100ms)

Para mais detalhes sobre o esquema do banco de dados e implementação, consulte `BACKEND_ARCHITECTURE.md`.

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ e npm

### Configuração Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd agromie-v0.1
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
# Chave de API do OpenRouter (obrigatória para o agente de IA)
VITE_OPENROUTER_API_KEY=sua_chave_aqui

# Variáveis opcionais para debug (apenas se necessário)
VITE_DEBUG_STORAGE=false
VITE_DEBUG_FINANCIAL=false
VITE_DEBUG_LIVESTOCK=false
VITE_DEBUG_PASTURE=false
VITE_DEBUG_ORCHESTRATOR=false
```

**Como obter a chave do OpenRouter:**
1. Acesse https://openrouter.ai/keys
2. Crie uma nova chave de API
3. Copie e cole no arquivo `.env`

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra `http://localhost:8080` no navegador (porta configurada no `vite.config.ts`)

### Primeira Vez - Autenticação

O sistema atualmente usa **autenticação mock**:

1. Na página de login, você pode usar qualquer email/senha
2. O sistema criará uma sessão mock automaticamente
3. Os dados serão salvos localmente no navegador (localStorage)

**Nota**: Em produção, será implementada autenticação real com backend.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes do dashboard
│   ├── financial/      # Componentes do módulo financeiro
│   ├── layout/         # Layout e navegação
│   │   ├── AppHeader.tsx
│   │   ├── AppSidebar.tsx
│   │   └── AIAssistant.tsx
│   └── ui/             # Componentes UI base (shadcn)
├── contexts/           # Context providers
│   └── AuthContext.tsx # Autenticação mock
├── hooks/              # Custom hooks
│   ├── use-speech.tsx  # Reconhecimento de voz
│   └── use-mobile.tsx  # Detecção mobile
├── lib/                # Utilitários e helpers
│   ├── storage.ts      # Sistema de armazenamento local
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal (chat + KPIs)
│   ├── Index.tsx       # Página inicial
│   ├── Financeiro.tsx  # Módulo Financeiro
│   ├── Pecuaria.tsx    # Módulo do Rebanho
│   ├── Pastagens.tsx   # Módulo de Pastagens
│   ├── AIChat.tsx      # Interface de chat dedicada
│   ├── TestSuite.tsx   # Suite de testes E2E
│   ├── Login.tsx       # Página de login
│   ├── Signup.tsx      # Página de registro
│   └── NotFound.tsx    # Página 404
├── services/           # Lógica de negócio
│   ├── financial.ts    # Serviços financeiros
│   ├── livestock.ts    # Serviços do rebanho
│   ├── pasture.ts      # Serviços de pastagens
│   ├── ai-agent.ts     # Executor de ações (usado como tool)
│   ├── ai-orchestrator.ts  # Orchestrator LLM-centered
│   └── ai-tools.ts     # Ferramentas (tools) para o LLM
├── types/              # Definições TypeScript
│   ├── financial.ts
│   ├── livestock.ts
│   ├── pasture.ts
│   └── ai-assistant.ts
├── tests/              # Testes
│   └── e2e-test-suite.ts  # Suite de testes E2E
└── App.tsx             # Componente principal
```

## 📊 Status de Implementação

### ✅ Fase 1 - Módulo Financeiro (CONCLUÍDA)

- [x] Plano de contas configurável
- [x] CRUD de transações (receitas, despesas, investimentos, retiradas)
- [x] Cálculo automático de margens (Bruta, Operacional, Líquida)
- [x] Consolidação mensal e anual
- [x] Fluxo de caixa
- [x] API de integração
- [x] Integração automática com Rebanho (compras/vendas)
- [x] Integração automática com Pastagens (manutenção/formação)

### ✅ Fase 2 - Módulo do Rebanho (CONCLUÍDA)

- [x] Categorias zootécnicas
- [x] CRUD de animais e eventos
- [x] Cálculo de indicadores zootécnicos
- [x] Integração automática com Financeiro
- [x] Registro de nascimentos, mortes, compras, vendas, pesagens
- [x] Cálculo de valor patrimonial
- [x] Integração com Pastagens (UA total)

### ✅ Fase 3 - Módulo de Pastagens (CONCLUÍDA)

- [x] Gestão de áreas de pasto
- [x] Cálculo de capacidade de suporte e lotação
- [x] Registro de manejo
- [x] Integração com Rebanho (UA total) e Financeiro
- [x] Busca de pastos por nome (fuzzy matching)
- [x] Atualização de nomes de pastos
- [x] Lista detalhada de pastos no dashboard
- [x] Status de lotação (IDEAL/SUBLOTADO/SUPERLOTADO)

### ✅ Fase 4 - Agente de IA (CONCLUÍDA)

- [x] Integração com OpenRouter (Google Gemini 2.0 Flash Lite)
- [x] Agente unificado (interpretação + execução)
- [x] Arquitetura LLM-centered com function calling
- [x] Prompt híbrido (conversa natural + JSON oculto)
- [x] Interface de chat integrada ao Dashboard
- [x] Base de conhecimento Embrapa
- [x] Suporte a múltiplas ações em uma mensagem
- [x] Intent `registrar_inventario_rebanho` (animais existentes sem compra)
- [x] Intent `operacao_complexa_rebanho` (múltiplas pastagens + animais)
- [x] Sistema de debug extensivo com logs detalhados
- [x] Processamento de pastos mencionados na venda
- [x] Loop de raciocínio autônomo

## 🔗 Integrações Automáticas

O sistema possui integrações automáticas entre módulos, garantindo que "quando uma engrenagem gira, todas as outras giram juntas":

### Financeiro ↔ Rebanho
- ✅ **Compras de animais** → Criam investimentos automaticamente no financeiro
- ✅ **Vendas de animais** → Criam receitas automaticamente no financeiro
- ✅ Conversão correta de valores (reais ↔ centavos)

### Pastagens ↔ Financeiro
- ✅ **Manutenção de pastagens** → Criam despesas automaticamente
- ✅ **Formação/Reforma de pastagens** → Criam investimentos automaticamente

### Pastagens ↔ Rebanho
- ✅ **UA total** calculada automaticamente do rebanho
- ✅ **Taxa de lotação** atualizada automaticamente
- ✅ **Status de lotação** (IDEAL/SUBLOTADO/SUPERLOTADO) calculado automaticamente

### Agente de IA
- ✅ **Interpretação automática** de linguagem natural
- ✅ **Extração automática** de entidades (data, categoria, quantidade, preço, pastos)
- ✅ **Execução automática** de ações em todos os módulos
- ✅ **Atualização automática** de métricas do dashboard

### Status de Integração

**Status Geral**: Sistema 90% funcional e 85% integrado.

**Integrações Funcionando:**
- ✅ **Financeiro ↔ Rebanho**: 100% (compras/vendas atualizam automaticamente)
- ✅ **Pastagens ↔ Financeiro**: 100% (manutenção/formação atualizam automaticamente)
- ✅ **Pastagens ↔ Rebanho**: 70% (UA calculada, falta associação real de animais)
- ✅ **Agente de IA**: 95% (LLM-centered com function calling)

## ⚠️ Limitações Conhecidas

### Funcionalidades
- ⚠️ **Animais não associados diretamente a pastos específicos**: Atualmente usa distribuição proporcional. Planejado: implementar `pastureId` em animais.
- ⚠️ **Validação de pastos na venda**: Poderia ser mais rigorosa
- ⚠️ **Autenticação mock**: Sistema atual usa localStorage para autenticação. Preparado para migração para autenticação real.
- ⚠️ **Persistência local**: Dados salvos apenas no navegador (localStorage). Preparado para migração para backend real.

### UI e Navegação do Agente
- ⚠️ **Navegação do agente**: O agente precisa de uma UI para navegar também. Integração MCP Playwright planejada para capacidades de navegação.

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Build em modo desenvolvimento
npm run build:dev

# Preview do build
npm run preview

# Lint
npm run lint
```

### Debugging

Todos os logs estão no console do navegador (F12):

**Símbolos de Log:**
- 🔵 = Processamento do agente (LLM + Execução)
- 💾 = Operações de storage (localStorage)
- 🟢 = Criação de registros (animais, transações, etc.)
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso

**Logs Detalhados:**
- Interpretação de mensagens do usuário
- Parsing de JSON do LLM
- Execução de ações por módulo
- Cálculo de métricas
- Operações de persistência (localStorage)

**Variáveis de Ambiente para Debug:**

Para habilitar logs detalhados, adicione ao `.env`:
```env
VITE_DEBUG_STORAGE=true
VITE_DEBUG_FINANCIAL=true
VITE_DEBUG_LIVESTOCK=true
VITE_DEBUG_PASTURE=true
VITE_DEBUG_ORCHESTRATOR=true
```

**Padrão**: Logs reduzidos (apenas erros e avisos importantes)

### Testes

O projeto inclui uma **suite de testes E2E** (`src/tests/e2e-test-suite.ts`) que simula operações reais:

**Testes Disponíveis:**
1. Registro de Pastagens
2. Compra de Animais + Integração Financeira
3. Cálculo de UA e Taxa de Lotação
4. Venda de Animais + Integração Financeira
5. Cálculo de Métricas Financeiras
6. Registro de Despesa
7. Registro de Manejo de Pastagem
8. Cálculo de Métricas do Rebanho
9. Verificação de UA Após Venda
10. Validação de Integridade de Dados

**Acesso**: Execute os testes em `/testes` (página TestSuite)

## 🎨 Design System

### Paleta de Cores
- **Primária**: Verde escuro (agro, sério)
- **Secundária**: Preto e branco
- **Acentos**: Tons de verde

### Componentes UI
- Baseado em **shadcn/ui**
- Design responsivo
- Acessibilidade (ARIA)

## 📝 Notas Importantes

### Persistência Atual
- O sistema atualmente usa **localStorage** para persistência temporária
- Estrutura preparada para migração para backend real (REST API, banco de dados)
- Todos os dados são salvos localmente no navegador
- Sistema de storage padronizado em `src/lib/storage.ts`

### Integrações Externas
- **OpenRouter API**: Configurada via `VITE_OPENROUTER_API_KEY`
- Modelo padrão: `google/gemini-2.0-flash-lite-001`
- Requer chave de API válida no arquivo `.env`

### Metodologias
- Baseado em metodologias validadas pela **Embrapa**
- Nomenclaturas zootécnicas padronizadas
- Cálculos seguem referências científicas

### Autenticação
- Sistema atual usa **autenticação mock** com localStorage
- Estrutura preparada para autenticação real
- AuthContext implementado e funcional

### Correções e Melhorias Recentes

**v0.2.0 (Janeiro 2025)**
- ✅ **Remoção completa do Supabase**: Sistema migrado para localStorage
- ✅ **Autenticação mock**: Implementada para desenvolvimento sem backend
- ✅ **Tratamento de erros 401**: Mensagens claras para chave de API inválida
- ✅ **Correção de bugs**: Sintaxe, imports, rotas

**v0.1.1 (Janeiro 2025)**
- ✅ **Dashboard melhorado**: Painéis recolhíveis (collapsible) para economizar espaço
- ✅ **KPIs expandidos**: Mais métricas de pastagens (detalhes por pasto, tamanho, lotação)
- ✅ **Busca de pastos por nome**: Sistema identifica pastos por nome na venda de animais
- ✅ **Atualização de nomes de pastos**: Suporte para editar nomes de pastos durante vendas
- ✅ **Correção de atualização**: Dashboard financeiro atualiza corretamente após ações
- ✅ **Melhorias de UX**: Lista detalhada de pastos registrados no dashboard

**v0.1.0 (Base)**
- ✅ Correção do erro `AccountGroup is not defined` (import corrigido)
- ✅ Correção de conversão de valores (centavos ↔ reais)
- ✅ Sistema de debug extensivo implementado
- ✅ Intent `registrar_inventario_rebanho` para animais existentes
- ✅ Dashboard integrado com chat e KPIs em tempo real
- ✅ Sidebar simplificada (Dashboard, Pecuária, Financeiro, Pastagens)

## 🗺️ Roadmap

Consulte o arquivo [`roadmap.md`](roadmap.md) para ver o plano completo de desenvolvimento e próximas fases.

### Próximas Melhorias Planejadas

**Curto Prazo:**
- [ ] Associação direta de animais com pastos (`pastureId` em animais)
- [ ] Validação de capacidade de pastos ao adicionar animais
- [ ] Movimentação de animais entre pastos
- [ ] Dashboard de pastagens com visualização de animais por pasto
- [ ] Cálculo de UA por pasto baseado em animais reais (não proporcional)

**Médio Prazo:**
- [ ] Integração MCP Playwright para navegação do agente
- [ ] UI melhorada para navegação do agente
- [ ] Backend real (migração de localStorage)
- [ ] Autenticação real

**Longo Prazo:**
- [ ] Integração WhatsApp
- [ ] Relatórios avançados
- [ ] Módulos adicionais (Lavouras, Insumos, Rastreabilidade)

## 📄 Licença

Este projeto é privado.

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Para contribuições, consulte o roadmap e as issues abertas.

---

**Versão**: 0.2.0  
**Última atualização**: Janeiro 2025  
**Status**: Todas as 4 fases principais concluídas. Sistema funcional com localStorage e autenticação mock.
