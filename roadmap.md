# Roadmap do Produto – AgrOmie ERP Rural

## 📋 Contexto do Projeto

O AgrOmie é um ERP integrado e simplificado para pequenas propriedades rurais, especialmente focado em pecuária de corte. A maioria dos produtores rurais utiliza métodos manuais (papel e caneta), o que dificulta acompanhar lucro, despesas, crescimento do rebanho, eficiência das pastagens e indicadores produtivos.

O AgrOmie foi concebido para resolver esse problema com uma plataforma composta por quatro módulos centrais — **Financeiro**, **Rebanho**, **Pastagens** e **Agente de IA** — que funcionam de forma integrada. Assim, um único evento registrado pelo produtor (ex.: venda de animais) atualiza automaticamente todos os módulos relacionados.

Este roadmap define o plano evolutivo para o desenvolvimento completo do sistema.

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
- ✅ Integração com Rebanho:
  - O total de UA atualiza automaticamente a taxa de lotação
- ✅ Integração com Financeiro:
  - Manutenção → despesas
  - Formação/reforma → investimentos

### Resultado da Fase
O produtor entende se suas pastagens suportam o rebanho, evita degradação e toma decisões melhores sobre manejo.

---

## ✅ Fase 4 — Agente de IA Integrado — **CONCLUÍDA**

### Objetivo da Fase
Permitir que o produtor registre eventos e gerencie toda a fazenda utilizando linguagem natural (texto/áudio). Este módulo é o "cérebro" do sistema.

### Entregas Implementadas ✅

- ✅ API de integração com OpenRouter
- ✅ Pipeline de interpretação:
  - Intents do produtor (comprar, vender, lançar despesa, registrar nascimento, etc.)
  - Extração de entidades (data, categoria, quantidade, preço, peso, etc.)
- ✅ Execução automática das ações:
  - Atualizações no financeiro
  - Atualizações no rebanho
  - Atualizações nas pastagens
- ✅ Base de conhecimento integrada com nomenclaturas Embrapa
- ✅ Interface de chat integrada ao Dashboard (estilo ChatGPT)
- ✅ Prompt híbrido: conversa natural + JSON oculto
- ✅ Suporte a múltiplas ações em uma única mensagem
- ✅ Intent `registrar_inventario_rebanho` para animais existentes
- ✅ Sistema de debug extensivo com logs detalhados
- ✅ Atualização automática de métricas após cada ação

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
- `registrar_inventario_rebanho` (novo: animais já existentes na fazenda, sem compra)
- `registrar_movimentação_rebanho`

**Pastagens:**
- `registrar_area_pasto`
- `registrar_manejo_pasto`

**Consultas:**
- `consultar_financeiro`
- `consultar_rebanho`
- `consultar_pastagens`
- `consultar_margens`

**Sistema:**
- `solicitar_dados` (quando faltam informações)

### Resultado da Fase
O produtor não precisa mais saber usar ERP, nem entender números complexos — basta falar com o agente, que fará tudo por ele.

---

## 🚀 Próximas Fases (Futuro)

### Fase 5 — Backend e Persistência
- [ ] Migração de localStorage para backend real
- [ ] API REST completa
- [ ] Banco de dados (PostgreSQL/MySQL)
- [ ] Autenticação e autorização
- [ ] Sincronização offline/online

### Fase 6 — Integração WhatsApp
- [ ] Bot WhatsApp como entry point
- [ ] Processamento de mensagens de voz
- [ ] Notificações automáticas
- [ ] Relatórios via WhatsApp

### Fase 7 — Relatórios e Dashboards Avançados
- [ ] Relatórios personalizados
- [ ] Gráficos e visualizações avançadas
- [ ] Exportação (PDF, Excel)
- [ ] Comparativos históricos

### Fase 8 — Módulos Adicionais
- [ ] Gestão de Lavouras (se necessário)
- [ ] Controle de Insumos
- [ ] Rastreabilidade
- [ ] Integração com APIs de clima

---

## 📅 Linha do Tempo Estimada (Macro)

| Fase | Módulo | Status | Duração Estimada |
|------|--------|--------|------------------|
| 1 | Financeiro | ✅ Concluída | 6–8 semanas |
| 2 | Rebanho | ✅ Concluída | 8–10 semanas |
| 3 | Pastagens | ✅ Concluída | 6–8 semanas |
| 4 | Agente de IA | ✅ Concluída | 10–14 semanas |
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

---

## 🎯 Visão Final

Ao final de todas as fases implementadas, o AgrOmie é:

- ✅ Um ERP rural integrado, simples e acessível
- ✅ Capaz de automatizar 80–90% da gestão da fazenda
- ✅ Baseado em metodologias validadas pela Embrapa
- ✅ Operado majoritariamente por voz/texto via agente de IA
- ✅ Amigável para produtores com baixa familiaridade com tecnologia

O produtor finalmente tem clareza total dos números da fazenda — custos, margens, rebanho, pastagens — tudo atualizado automaticamente, sem trabalho manual.

---

## 📊 Status Atual do Projeto

### ✅ Implementado
- Todas as 4 fases principais concluídas
- Sistema funcional com localStorage
- Interface completa e responsiva
- Agente de IA unificado operacional
- Dashboard integrado (chat + KPIs)
- **Página de Pastagens completa** (criada recentemente)
- Sidebar com todos os módulos (Dashboard, Pecuária, Financeiro, Pastagens, Configurações)
- Sistema de debug extensivo
- Correções de bugs críticos (AccountGroup, conversão de valores)
- **Painéis recolhíveis no dashboard**
- **KPIs expandidos** (Financeiro, Rebanho, Pastagens)
- **Busca de pastos por nome** (fuzzy matching)
- **Processamento de pastos na venda** (atualização de nomes, distribuição)
- **Limites de lotação ajustados** (70-130%)

### 🔄 Em Desenvolvimento
- Melhorias contínuas no agente de IA
- Refinamento do prompt híbrido
- Otimizações de performance
- Testes de integração entre módulos

### 📋 Planejado
- Migração para backend real
- Integração WhatsApp
- Relatórios avançados
- Módulos adicionais
- Autenticação e multi-usuário

---

**Última atualização**: Janeiro 2025  
**Versão do Roadmap**: 2.3

### 📊 Status Detalhado por Fase

**Fase 1 - Financeiro**: ✅ 100% Concluída  
**Fase 2 - Rebanho**: ✅ 100% Concluída  
**Fase 3 - Pastagens**: ✅ 100% Concluída (incluindo interface)  
**Fase 4 - Agente de IA**: ✅ 100% Concluída (com melhorias)  

**Próxima Fase**: Fase 5 - Backend e Persistência (planejada)

### 🔧 Correções e Melhorias Recentes

**v2.2 (Janeiro 2025)**
- ✅ **Página de Pastagens**: Interface completa criada (`Pastagens.tsx`)
- ✅ **Painéis recolhíveis**: Dashboard com cards collapsible
- ✅ **KPIs expandidos**: Mais métricas em Financeiro, Rebanho e Pastagens
- ✅ **Busca de pastos**: Função `getByName()` com fuzzy matching
- ✅ **Processamento de pastos**: Identificação e atualização de nomes na venda
- ✅ **Limites ajustados**: Taxa de lotação de 70-130% (era 80-120%)

**v2.1 (Base)**
- ✅ **Correção crítica**: Erro `AccountGroup is not defined` resolvido (import corrigido)
- ✅ **Correção de valores**: Conversão correta entre centavos e reais em todas as integrações
- ✅ **Sistema de debug**: Logs detalhados em todos os módulos para rastreamento
- ✅ **Intent novo**: `registrar_inventario_rebanho` para registrar animais existentes sem compra
- ✅ **Arquitetura unificada**: Agente frontend/backend unificado em `ai-agent.ts`
- ✅ **Dashboard integrado**: Chat e KPIs na mesma página principal
- ✅ **Navegação simplificada**: Sidebar com módulos principais
