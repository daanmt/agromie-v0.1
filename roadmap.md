# Roadmap do Produto – AgrOmie ERP Rural

## 📋 Contexto do Projeto

O AgrOmie é um ERP integrado e simplificado para pequenas propriedades rurais, especialmente focado em pecuária de corte. A maioria dos produtores rurais utiliza métodos manuais (papel e caneta), o que dificulta acompanhar lucro, despesas, crescimento do rebanho, eficiência das pastagens e indicadores produtivos.

O AgrOmie foi concebido para resolver esse problema com uma plataforma composta por quatro módulos centrais — **Financeiro**, **Rebanho**, **Pastagens** e **Agente de IA** — que funcionam de forma integrada. Assim, um único evento registrado pelo produtor (ex.: venda de animais) atualiza automaticamente todos os módulos relacionados.

**Proposta de Valor**: Trazer **praticidade e IA** para a gestão rural, permitindo que o produtor gerencie toda a fazenda através de linguagem natural, sem necessidade de entender ERP ou números complexos.

Este roadmap define o plano evolutivo para o desenvolvimento completo do sistema.

---

## ✅ Fase 0 — Visual Foundation Enhancement — **CONCLUÍDA**

### Objetivo da Fase

Estabelecer uma fundação visual sólida para todo o sistema AgrOmie, transformando o projeto de um MVP funcional para um produto com visual profissional e polido.

### Entregas Implementadas ✅

**1. Typography System** (100% completo)
- ✅ Instalação de fontes premium (Inter, Manrope) via Fontsource
- ✅ Configuração completa do Tailwind com escala tipográfica (9 tamanhos)
- ✅ Aplicação da nova tipografia em componentes principais
- ✅ Hierarquia visual clara e profissional

**2. Color Palette Expansion** (100% completo)
- ✅ Data Visualization Palette (chart-blue, chart-purple, chart-teal, chart-amber)
- ✅ Secondary Warm Accent (terra-cotta para CTAs)
- ✅ Surface Colors (3 níveis de cinza para profundidade)
- ✅ Gradients definidos (primary, card, success)

**3. Depth & Shadow System** (100% completo)
- ✅ Sistema de sombras completo (9 variantes: sm, md, lg, xl, card, card-hover, success, error)
- ✅ Transições suaves (fast 150ms, normal 250ms, slow 350ms)
- ✅ Componentes aprimorados:
  - Card com variantes (default, success, warning, accent) + hover lift
  - Button com variante `soft`, sombras, active scale
  - Badge com 5 variantes semânticas

**4. Spacing Audit & Consistency** (90% completo)
- ✅ Dashboard e Financeiro com spacing sistemático (4px/8px grid)
- ✅ Consistência visual em páginas principais
- ✅ Respiração visual adequada

### Arquivos Criados

- `/context/design-principles.md` - Checklist completo de design e acessibilidade
- `/context/style-guide.md` - Paleta de cores, tipografia, sombras, exemplos

### Métricas de Sucesso

**Visual Quality (Antes → Depois)**
- **Grade Geral**: B- → A
- **Typography**: C+ → A+
- **Color System**: B → A+
- **Depth & Shadows**: C → A
- **Spacing Consistency**: B- → A

### Resultado da Fase

Sistema com visual profissional, hierarquia clara, e fundação sólida para todas as fases futuras de UI/UX.

**Referência**: Baseado em AESTHETIC_ROADMAP.md Fase 1 (concluída em Dezembro 2025)

---

## ✅ Fase 1 — Módulo Financeiro (CORE) — **CONCLUÍDA**

### Objetivo da Fase

Construir a base econômica e contábil do sistema, inspirada no Controlpec e CUSTObov da Embrapa. Este módulo é o ponto central da consolidação de dados e do cálculo de margens.

### Entregas Implementadas ✅

- ✅ Plano de contas configurável baseado nos grupos: Despesas, Receitas, Investimentos, Pró-labore
- ✅ Lançamentos de receitas, despesas, investimentos e retiradas
- ✅ Consolidação mensal e anual dos registros
- ✅ Cálculo automático de:
  - Margem Bruta
  - Margem Operacional
  - Margem Líquida
  - Custo operacional da fazenda
  - Fluxo de caixa básico
- ✅ Estrutura de API para receber comandos de outros módulos
- ✅ Sistema de persistência padronizado (localStorage, preparado para backend)
- ✅ Integração automática com Rebanho (compras/vendas)
- ✅ Integração automática com Pastagens (manutenção/formação)

### Resultado da Fase

O produtor passa a entender:
- Se a fazenda está em lucro ou prejuízo
- Onde está gastando
- Quais despesas pesam mais
- Como evolui o caixa ao longo dos meses

---

## ✅ Fase 2 — Módulo do Rebanho — **CONCLUÍDA**

### Objetivo da Fase

Implementar a gestão zootécnica completa, integrada ao financeiro.

### Entregas Implementadas ✅

- ✅ Estruturas de categorias (vacas, novilhas, bezerros, bois magros, bois gordos, tourunos, etc.)
- ✅ Registro de:
  - Nascimentos
  - Mortes
  - Compras e vendas
  - Pesagens e evoluções
  - Movimentações internas do rebanho
- ✅ Cálculo automático de indicadores:
  - Estoque zootécnico
  - Valor patrimonial do rebanho
  - GMD (Ganho Médio Diário)
  - Taxas de natalidade, mortalidade e desfrute
- ✅ Integração com o módulo financeiro:
  - Compras e vendas atualizam receitas/despesas automaticamente
  - Valorização/desvalorização do rebanho afeta margens
- ✅ Integração com Pastagens (UA total)

### Resultado da Fase

O produtor entende a evolução real do rebanho ao longo do tempo e seu impacto econômico direto.

---

## ✅ Fase 3 — Módulo de Pastagens — **CONCLUÍDA**

### Objetivo da Fase

Gerenciar o uso, a produtividade e os custos das pastagens, conectando-as diretamente ao tamanho e peso do rebanho.

### Entregas Implementadas ✅

- ✅ Registro de:
  - Áreas de pasto
  - Capacidade de suporte (UA/ha)
  - Taxa de lotação
  - Manejo de pastagens
  - Custos de manutenção e formação
- ✅ Cálculo de:
  - Balanço oferta vs demanda de forragem
  - Lotação real vs ideal
  - Superlotação ou subutilização
  - Status de lotação (IDEAL/SUBLOTADO/SUPERLOTADO)
- ✅ Integração com Rebanho:
  - O total de UA atualiza automaticamente a taxa de lotação
- ✅ Integração com Financeiro:
  - Manutenção → despesas
  - Formação/reforma → investimentos
- ✅ Busca de pastos por nome (fuzzy matching)
- ✅ Atualização de nomes de pastos
- ✅ Lista detalhada de pastos no dashboard

### Resultado da Fase

O produtor entende se suas pastagens suportam o rebanho, evita degradação e toma decisões melhores sobre manejo.

---

## ✅ Fase 4 — Agente de IA Integrado — **CONCLUÍDA**

### Objetivo da Fase

Permitir que o produtor registre eventos e gerencie toda a fazenda utilizando linguagem natural (texto/áudio). Este módulo é o "cérebro" do sistema e atua como **orchestrator** que coordena UX e interpreta o relato do manejo.

### Entregas Implementadas ✅

- ✅ API de integração com OpenRouter
- ✅ Arquitetura LLM-centered com function calling
- ✅ Pipeline de interpretação:
  - Intents do produtor (comprar, vender, lançar despesa, registrar nascimento, etc.)
  - Extração de entidades (data, categoria, quantidade, preço, peso, pastos, etc.)
- ✅ Execução automática das ações:
  - Atualizações no financeiro
  - Atualizações no rebanho
  - Atualizações nas pastagens
- ✅ Base de conhecimento integrada com nomenclaturas Embrapa
- ✅ Interface de chat integrada ao Dashboard (estilo ChatGPT)
- ✅ Prompt híbrido: conversa natural + JSON oculto
- ✅ Suporte a múltiplas ações em uma única mensagem
- ✅ Intent `registrar_inventario_rebanho` para animais existentes
- ✅ Intent `operacao_complexa_rebanho` (múltiplas pastagens + animais)
- ✅ Sistema de debug extensivo com logs detalhados
- ✅ Atualização automática de métricas após cada ação
- ✅ Loop de raciocínio autônomo

### Arquitetura do Agente (LLM-Centered)

O sistema utiliza uma **arquitetura LLM-centered** (`ai-orchestrator.ts`) onde o LLM tem controle total sobre o fluxo:

**Arquitetura LLM-Centered:**
- **Orchestrator**: Gerencia loop de raciocínio autônomo
- **LLM**: Controla o fluxo de execução via function calling
- **Tools**: Ferramentas expostas ao LLM para interagir com o sistema
- **Executor**: `executeAction()` do `ai-agent.ts` (usado como tool)

**Fluxo:**
1. Usuário envia mensagem em linguagem natural
2. Orchestrator envia para LLM via OpenRouter (Google Gemini 2.0 Flash Lite) com function calling habilitado
3. LLM decide quais tools chamar e executa múltiplas chamadas em sequência
4. Tools executam ações automaticamente nos módulos apropriados
5. LLM valida resultados e pode repetir se necessário (loop de raciocínio)
6. LLM responde ao usuário de forma natural e humana
7. Dashboard atualiza métricas em tempo real

**Vantagens:**
- LLM pode fazer múltiplas tool calls em sequência
- Validação e correção automática
- Acesso a dados do storage antes de executar
- Loop de raciocínio até convergir

### Intents Suportados

**Financeiro:**
- `registrar_receita`
- `registrar_despesa`
- `registrar_investimento`
- `registrar_pró_labore`

**Rebanho:**
- `registrar_compra_animais`
- `registrar_venda_animais`
- `registrar_nascimento`
- `registrar_morte`
- `registrar_pesagem`
- `registrar_inventario_rebanho` (animais já existentes na fazenda, sem compra)
- `registrar_movimentação_rebanho`

**Pastagens:**
- `registrar_area_pasto`
- `registrar_manejo_pasto`

**Operações Complexas:**
- `operacao_complexa_rebanho` (múltiplas pastagens + compra de animais + distribuição)

**Consultas:**
- `consultar_financeiro`
- `consultar_rebanho`
- `consultar_pastagens`
- `consultar_margens`

**Sistema:**
- `limpar_cache`
- `resetar_dados`
- `resetar_rebanho`
- `resetar_financeiro`
- `resetar_pastagens`

### Resultado da Fase

O produtor não precisa mais saber usar ERP, nem entender números complexos — basta falar com o agente, que fará tudo por ele.

---

## 🚀 Próximas Fases (Futuro)

### Fase 5 — Backend e Persistência (Event-Sourcing + CQRS)

**Objetivo**: Migrar de localStorage para backend real com arquitetura Event-Sourcing e CQRS, otimizando performance e garantindo auditoria completa.

**Status**: 🔄 Planejada (Arquitetura definida, aguardando implementação)

#### Arquitetura Escolhida

**Event-Sourcing + CQRS + PostgreSQL**

A arquitetura foi projetada especificamente para:
1. **Otimizar o dashboard** (10x mais rápido com materialized views)
2. **Suportar o orchestrator LLM-centered** (atomicidade, auditoria, rollback)
3. **Garantir integridade** (eventos imutáveis, rastreabilidade total)
4. **Escalar** (multi-tenancy, 1000+ fazendas, 100k+ animais)

#### Entregas Planejadas (8 Fases de Implementação)

**Fase 5.1 - Setup Backend (2 semanas)**
- [ ] Estrutura do projeto backend (Express + TypeScript)
- [ ] Configuração PostgreSQL 15+
- [ ] Schema completo (entidades + event store + projections)
- [ ] Migrations com Drizzle ORM
- [ ] Docker Compose para desenvolvimento

**Fase 5.2 - API REST + Authentication (2 semanas)**
- [ ] 27+ endpoints REST (Livestock, Financial, Pasture)
- [ ] JWT Authentication (login, register, refresh)
- [ ] Middleware de autorização (farm-based)
- [ ] Integração frontend → API client layer

**Fase 5.3 - Event-Sourcing Core (2 semanas)**
- [ ] Event Store implementation
- [ ] Command Handlers (write side)
  - `PurchaseAnimalCommand` → eventos
  - `SaleAnimalCommand` → eventos
  - `RegisterTransactionCommand` → eventos
- [ ] Query Handlers (read side)
- [ ] Projection Manager (rebuild de views)

**Fase 5.4 - Projections (1 semana)**
- [ ] `AnimalsProjection` → tabela `animals`
- [ ] `TransactionsProjection` → tabela `transactions`
- [ ] `KPIFinancialProjection` → view `kpi_financial_monthly`
- [ ] `KPILivestockProjection` → view `kpi_livestock_monthly`
- [ ] `KPIPastureProjection` → view `kpi_pasture_monthly`

**Fase 5.5 - Frontend Integration (1 semana)**
- [ ] API Client (`src/lib/api-client.ts`)
- [ ] Substituir storage calls por API calls
- [ ] Dashboard usando projeções (<100ms)
- [ ] Tratamento de erros e loading states

**Fase 5.6 - Orchestrator Integration (1 semana)**
- [ ] Atualizar `ai-tools.ts` para usar API
- [ ] Tool `executeIntent` → API endpoints
- [ ] Tool `queryStorage` → API queries
- [ ] WebSocket para updates em tempo real (opcional)

**Fase 5.7 - Migration Tool (1 semana)**
- [ ] Script de migração localStorage → PostgreSQL
- [ ] Interface de migração no frontend
- [ ] Validação de dados migrados
- [ ] Backup automático antes da migração

**Fase 5.8 - Deployment + Monitoring (1 semana)**
- [ ] Deploy backend (Railway, Render, ou Vercel)
- [ ] Deploy database (Supabase, Neon, ou Railway)
- [ ] Monitoring (logs, metrics, errors)
- [ ] Backup automático configurado

#### Estrutura do Banco de Dados

**Tabelas Core (7 tabelas)**
- `users` - Usuários
- `farms` - Fazendas (multi-tenancy)
- `user_farm_permissions` - Permissões
- `animals` - Animais individuais
- `livestock_batches` - Lotes (opcional)
- `pastures` - Áreas de pastagem
- `pasture_management` - Manejos
- `accounts_plan` - Plano de contas
- `transactions` - Transações financeiras
- `weighings` - Pesagens

**Event Store (3 tabelas)**
- `livestock_events` (tipos: birth, purchase, sale, death, move, weighing, inventory)
- `financial_events` (tipos: receita, despesa, investimento, retirada)
- `pasture_events` (tipos: formação, reforma, manutenção)

**Materialized Views (3 views)**
- `kpi_financial_monthly` - KPIs financeiros pré-calculados
- `kpi_livestock_monthly` - KPIs do rebanho pré-calculados
- `kpi_pasture_monthly` - KPIs de pastagens pré-calculados

#### Benefícios da Arquitetura

**Para o Sistema:**
- ✅ Auditoria total (todos os eventos rastreáveis)
- ✅ Histórico completo (replay de eventos)
- ✅ Performance 10x melhor (dashboard <100ms vs 500-1000ms)
- ✅ Multi-tenancy (isolamento por fazenda)
- ✅ Escalabilidade (1000+ fazendas, 100k+ animais)

**Para o Orchestrator (LLM-Centered):**
- ✅ Atomicidade (múltiplas tool calls seguras)
- ✅ Consistência (eventos garantem integridade)
- ✅ Rollback (reverter operações se necessário)
- ✅ Validação (LLM pode verificar antes de commitar)

**Para o Dashboard:**
- ✅ Métricas instantâneas (views pré-calculadas)
- ✅ Redução de cálculos em tempo real
- ✅ Queries otimizadas com índices
- ✅ Conexão pooling

#### Critérios de Sucesso

**Funcional:**
- ✅ Todos os endpoints REST funcionando
- ✅ Autenticação JWT operacional
- ✅ Event-sourcing completo (append + rebuild)
- ✅ Projections atualizadas em tempo real
- ✅ Frontend 100% integrado
- ✅ Orchestrator usando API
- ✅ Migration tool testado

**Performance:**
- ✅ Dashboard load time: <100ms (vs 500-1000ms atual)
- ✅ API response time p95: <200ms
- ✅ Materialized view refresh: <5s

**Segurança:**
- ✅ Row-level security (RLS) no PostgreSQL
- ✅ farmId em todas as queries (middleware)
- ✅ JWT com refresh tokens
- ✅ Rate limiting

**Escalabilidade:**
- ✅ Suporta 1000+ fazendas
- ✅ Suporta 100,000+ animais
- ✅ Suporta 1M+ eventos no event log

#### Riscos e Mitigações

**Risco 1: Migração corrompe dados**
- Mitigação: Backup completo do localStorage antes de migrar
- Rollback plan: Restaurar localStorage

**Risco 2: Performance pior que localStorage**
- Mitigação: Materialized views, caching, índices otimizados

**Risco 3: Orchestrator quebra com API**
- Mitigação: Retry logic, fallback offline, queue async

**Risco 4: Multi-tenancy vazamento de dados**
- Mitigação: RLS no PostgreSQL, farmId em todas as queries

#### Documentação Relacionada

- **Arquitetura Técnica**: `BACKEND_ARCHITECTURE.md`
- **Schema do Banco**: `BACKEND_ARCHITECTURE.md` (seção Database Schema)
- **Plano Completo**: Consultar `BACKEND_ARCHITECTURE.md` para detalhes de implementação

**Duração Estimada**: 8–10 semanas (divididas em 8 fases)

**Referência**: Baseado em CLAUDE_DATABASE.md e análise completa do codebase atual.

---

### Fase 6 — Integração WhatsApp

**Objetivo**: Permitir que o produtor use o sistema via WhatsApp, facilitando o acesso.

**Entregas Planejadas:**
- [ ] Bot WhatsApp como entry point
- [ ] Processamento de mensagens de voz (Speech-to-Text)
- [ ] Notificações automáticas
- [ ] Relatórios via WhatsApp
- [ ] Integração com n8n ou similar
- [ ] Webhook para recebimento de mensagens

**Critérios de Sucesso:**
- Produtor pode enviar comandos via WhatsApp
- Sistema responde via WhatsApp
- Notificações automáticas funcionam
- Suporte a áudio e texto

**Duração Estimada**: 6–8 semanas

---

### Fase 7 — Relatórios e Dashboards Avançados

**Objetivo**: Fornecer insights profundos através de visualizações e relatórios.

**Entregas Planejadas:**
- [ ] Relatórios personalizados
- [ ] Gráficos e visualizações avançadas
- [ ] Exportação (PDF, Excel)
- [ ] Comparativos históricos
- [ ] Análise de tendências
- [ ] Relatórios por período (mensal, trimestral, anual)

**Critérios de Sucesso:**
- Relatórios exportáveis em múltiplos formatos
- Gráficos interativos e informativos
- Comparativos históricos funcionais
- Análise de tendências precisa

**Duração Estimada**: 4–6 semanas

---

### Fase 8 — Módulos Adicionais

**Objetivo**: Expandir funcionalidades para outros aspectos da gestão rural.

**Entregas Planejadas:**
- [ ] Gestão de Lavouras (se necessário)
- [ ] Controle de Insumos
- [ ] Rastreabilidade
- [ ] Integração com APIs de clima
- [ ] Gestão de Equipamentos
- [ ] Controle de Mão de Obra

**Critérios de Sucesso:**
- Módulos adicionais funcionais
- Integrações com APIs externas operacionais
- Rastreabilidade completa implementada

**Duração Estimada**: Variável (depende dos módulos escolhidos)

---

## 🎨 Fase Especial — UI e Navegação do Agente

**Objetivo**: Melhorar a capacidade do agente de navegar e interagir com a UI.

**Contexto**: O agente deve ser um orchestrator, mas precisa de uma UI para navegar também. Posteriormente será integrado o MCP do Playwright para capacidades de navegação.

**Entregas Planejadas:**
- [ ] Melhorias de UI para navegação do agente
- [ ] Integração MCP Playwright para navegação
- [ ] Capacidade do agente de clicar, preencher formulários, navegar entre páginas
- [ ] Visualização do agente navegando (modo demo/transparente)
- [ ] Feedback visual das ações do agente na UI

**Critérios de Sucesso:**
- Agente pode navegar pela UI autonomamente
- Agente pode preencher formulários
- Agente pode clicar em botões e links
- Navegação é visualmente transparente para o usuário

**Duração Estimada**: 6–8 semanas

**Prioridade**: Alta (melhora significativamente a experiência do usuário)

---

## 📅 Linha do Tempo Estimada (Macro)

| Fase | Módulo | Status | Duração Estimada |
|------|--------|--------|------------------|
| 1 | Financeiro | ✅ Concluída | 6–8 semanas |
| 2 | Rebanho | ✅ Concluída | 8–10 semanas |
| 3 | Pastagens | ✅ Concluída | 6–8 semanas |
| 4 | Agente de IA | ✅ Concluída | 10–14 semanas |
| Especial | UI e Navegação | 🔄 Planejada | 6–8 semanas |
| 5 | Backend | 🔄 Planejada | 8–12 semanas |
| 6 | WhatsApp | 🔄 Planejada | 6–8 semanas |
| 7 | Relatórios | 🔄 Planejada | 4–6 semanas |
| 8 | Módulos Extras | 🔄 Planejada | Variável |

---

## 🔗 Dependências Entre Módulos

- O **Financeiro** é pré-requisito para cálculos econômicos
- O **Rebanho** depende do Financeiro para computar custos e margens
- **Pastagens** dependem do Rebanho (UA) para calcular lotação
- O **Agente de IA** depende da API consolidada dos três módulos
- **UI e Navegação do Agente** depende do Agente de IA estar funcional
- **Backend** é pré-requisito para produção e escalabilidade
- **WhatsApp** depende do Agente de IA e Backend
- **Relatórios** dependem de dados históricos (Backend)

---

## 🎯 Visão Final

Ao final de todas as fases implementadas, o AgrOmie é:

- ✅ Um ERP rural integrado, simples e acessível
- ✅ Capaz de automatizar 80–90% da gestão da fazenda
- ✅ Baseado em metodologias validadas pela Embrapa
- ✅ Operado majoritariamente por voz/texto via agente de IA
- ✅ Amigável para produtores com baixa familiaridade com tecnologia
- ✅ Acessível via múltiplos canais (Web, WhatsApp)
- ✅ Com agente capaz de navegar e interagir com a UI

O produtor finalmente tem clareza total dos números da fazenda — custos, margens, rebanho, pastagens — tudo atualizado automaticamente, sem trabalho manual.

---

## 📊 Status Atual do Projeto

### ✅ Implementado

- Todas as 4 fases principais concluídas
- Sistema funcional com localStorage
- Interface completa e responsiva
- Agente de IA unificado operacional
- Dashboard integrado (chat + KPIs)
- Página de Pastagens completa
- Sidebar com todos os módulos (Dashboard, Pecuária, Financeiro, Pastagens)
- Sistema de debug extensivo
- Correções de bugs críticos (AccountGroup, conversão de valores)
- Painéis recolhíveis no dashboard
- KPIs expandidos (Financeiro, Rebanho, Pastagens)
- Busca de pastos por nome (fuzzy matching)
- Processamento de pastos na venda (atualização de nomes, distribuição)
- Limites de lotação ajustados (70-130%)
- Autenticação mock funcional
- Remoção completa do Supabase

### 🔄 Em Desenvolvimento

- Melhorias contínuas no agente de IA
- Refinamento do prompt híbrido
- Otimizações de performance
- Testes de integração entre módulos

### 📋 Planejado

- UI e navegação do agente (Fase Especial)
- Migração para backend real (Fase 5)
- Integração WhatsApp (Fase 6)
- Relatórios avançados (Fase 7)
- Módulos adicionais (Fase 8)

---

**Última atualização**: Janeiro 2025  
**Versão do Roadmap**: 3.0

### 📊 Status Detalhado por Fase

**Fase 1 - Financeiro**: ✅ 100% Concluída  
**Fase 2 - Rebanho**: ✅ 100% Concluída  
**Fase 3 - Pastagens**: ✅ 100% Concluída (incluindo interface)  
**Fase 4 - Agente de IA**: ✅ 100% Concluída (com melhorias)

**Próxima Fase**: Fase Especial - UI e Navegação do Agente (planejada)

### 🔧 Correções e Melhorias Recentes

**v0.2.0 (Janeiro 2025)**
- ✅ **Remoção completa do Supabase**: Sistema migrado para localStorage
- ✅ **Autenticação mock**: Implementada para desenvolvimento sem backend
- ✅ **Tratamento de erros 401**: Mensagens claras para chave de API inválida
- ✅ **Correção de bugs**: Sintaxe, imports, rotas

**v0.1.1 (Janeiro 2025)**
- ✅ **Página de Pastagens**: Interface completa criada (`Pastagens.tsx`)
- ✅ **Painéis recolhíveis**: Dashboard com cards collapsible
- ✅ **KPIs expandidos**: Mais métricas em Financeiro, Rebanho e Pastagens
- ✅ **Busca de pastos**: Função `getByName()` com fuzzy matching
- ✅ **Processamento de pastos**: Identificação e atualização de nomes na venda
- ✅ **Limites ajustados**: Taxa de lotação de 70-130% (era 80-120%)

**v0.1.0 (Base)**
- ✅ **Correção crítica**: Erro `AccountGroup is not defined` resolvido (import corrigido)
- ✅ **Correção de valores**: Conversão correta entre centavos e reais em todas as integrações
- ✅ **Sistema de debug**: Logs detalhados em todos os módulos para rastreamento
- ✅ **Intent novo**: `registrar_inventario_rebanho` para registrar animais existentes sem compra
- ✅ **Arquitetura unificada**: Agente frontend/backend unificado em `ai-agent.ts`
- ✅ **Dashboard integrado**: Chat e KPIs na mesma página principal
- ✅ **Navegação simplificada**: Sidebar com módulos principais
