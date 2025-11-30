# AgrOmie ERP Rural

> Sistema de gestão integrado e simplificado para pequenas propriedades rurais, especialmente focado em pecuária de corte.

## 🎯 Visão do Projeto

O AgrOmie foi concebido para resolver o problema de gestão manual (papel e caneta) enfrentado pela maioria dos produtores rurais. O sistema permite que o produtor gerencie toda a fazenda através de linguagem natural, sem necessidade de entender ERP ou números complexos.

### Problema que Resolve

- ❌ **Antes**: Gestão manual com papel e caneta, difícil acompanhar lucro, despesas, crescimento do rebanho e eficiência das pastagens
- ✅ **Depois**: Sistema integrado que automatiza 80-90% da gestão, operado por voz/texto via agente de IA

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

### 3. **Módulo de Pastagens**
Gerenciamento de uso, produtividade e custos das pastagens.

**Funcionalidades:**
- Registro de áreas de pasto e capacidade de suporte (UA/ha)
- Taxa de lotação
- Manejo de pastagens (formação, reforma, manutenção)
- Cálculo de balanço oferta vs demanda de forragem
- Integração com Rebanho (UA total atualiza lotação)
- Integração com Financeiro (manutenção → despesas, formação → investimentos)

### 4. **Agente de IA Integrado (LLM-Centered)**
Operação por linguagem natural (texto/áudio) com arquitetura LLM-centered.

**Funcionalidades:**
- Interpretação de linguagem natural via LLM (OpenRouter/Gemini)
- Arquitetura LLM-centered com function calling
- Loop de raciocínio autônomo (múltiplas tool calls em sequência)
- Validação e correção automática
- Extração automática de entidades (data, categoria, quantidade, preço, etc.)
- Execução automática de ações em todos os módulos
- Base de conhecimento com nomenclaturas Embrapa
- Interface de chat dedicada (estilo ChatGPT)

**Tools Disponíveis:**
- `executeIntent` - Executar ações do sistema (principal)
- `queryStorage` / `mutateStorage` - Acessar dados do localStorage
- `readFile` / `writeFile` - Leitura/escrita de arquivos (preparado para backend)
- `log` - Registro de mensagens
- Outras tools para análise e validação

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **shadcn/ui** + **Tailwind CSS** (UI components)
- **React Router** (roteamento)
- **React Hook Form** + **Zod** (formulários e validação)

### Backend (Atual)
- **localStorage** (persistência temporária)
- Estrutura preparada para migração para backend real

### IA
- **OpenRouter API** (integração com LLMs)
- **Google Gemini 2.0 Flash Lite** (modelo padrão)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ e npm

### Configuração

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
VITE_OPENROUTER_API_KEY=sua_chave_aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra `http://localhost:5173` no navegador

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes do dashboard
│   ├── financial/      # Componentes do módulo financeiro
│   ├── layout/         # Layout e navegação
│   └── ui/             # Componentes UI base (shadcn)
├── hooks/              # Custom hooks
├── lib/                # Utilitários e helpers
│   └── storage.ts      # Sistema de armazenamento local
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal (chat + KPIs)
│   ├── Financeiro.tsx  # Módulo Financeiro
│   ├── Pecuaria.tsx    # Módulo do Rebanho
│   └── NotFound.tsx    # Página 404
├── services/           # Lógica de negócio
│   ├── financial.ts    # Serviços financeiros
│   ├── livestock.ts    # Serviços do rebanho
│   ├── pasture.ts      # Serviços de pastagens
│   ├── ai-agent.ts     # Executor de ações (usado como tool)
│   ├── ai-orchestrator.ts  # Orchestrator LLM-centered
│   ├── ai-tools.ts     # Ferramentas (tools) para o LLM
│   └── ai-orchestrator-example.ts  # Exemplos de uso
├── types/              # Definições TypeScript
│   ├── financial.ts
│   ├── livestock.ts
│   ├── pasture.ts
│   └── ai-assistant.ts
└── App.tsx             # Componente principal
```

## 🔄 Arquitetura LLM-Centered

O sistema utiliza uma **arquitetura LLM-centered** onde o LLM tem controle total sobre o fluxo de execução:

### Arquitetura LLM-Centered

O orchestrator opera com **function calling**:

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

- **Financeiro**: `registrar_receita`, `registrar_despesa`, `registrar_investimento`, `registrar_pró_labore`
- **Rebanho**: `registrar_compra_animais`, `registrar_venda_animais`, `registrar_nascimento`, `registrar_morte`, `registrar_pesagem`, `registrar_inventario_rebanho`, `registrar_movimentação_rebanho`
- **Pastagens**: `registrar_area_pasto`, `registrar_manejo_pasto`
- **Operações Complexas**: `operacao_complexa_rebanho` (múltiplas pastagens + compra de animais + distribuição)
- **Consultas**: `consultar_financeiro`, `consultar_rebanho`, `consultar_pastagens`, `consultar_margens`
- **Sistema**: `limpar_cache`, `resetar_dados`, `resetar_rebanho`, `resetar_financeiro`, `resetar_pastagens`

## 📊 Status de Implementação

### ✅ Fase 1 - Módulo Financeiro
- [x] Plano de contas configurável
- [x] CRUD de transações (receitas, despesas, investimentos, retiradas)
- [x] Cálculo automático de margens
- [x] Consolidação mensal e anual
- [x] Fluxo de caixa
- [x] API de integração
- [x] Integração automática com Rebanho (compras/vendas)

### ✅ Fase 2 - Módulo do Rebanho
- [x] Categorias zootécnicas
- [x] CRUD de animais e eventos
- [x] Cálculo de indicadores zootécnicos
- [x] Integração automática com Financeiro
- [x] Registro de nascimentos, mortes, compras, vendas, pesagens
- [x] Cálculo de valor patrimonial

### ✅ Fase 3 - Módulo de Pastagens
- [x] Gestão de áreas de pasto
- [x] Cálculo de capacidade de suporte e lotação
- [x] Registro de manejo
- [x] Integração com Rebanho (UA total) e Financeiro
- [x] Busca de pastos por nome (fuzzy matching)
- [x] Atualização de nomes de pastos
- [x] Lista detalhada de pastos no dashboard

### ✅ Fase 4 - Agente de IA
- [x] Integração com OpenRouter (Google Gemini 2.0 Flash Lite)
- [x] Agente unificado (interpretação + execução)
- [x] Prompt híbrido (conversa natural + JSON oculto)
- [x] Interface de chat integrada ao Dashboard
- [x] Base de conhecimento Embrapa
- [x] Suporte a múltiplas ações em uma mensagem
- [x] Intent `registrar_inventario_rebanho` (animais existentes sem compra)
- [x] Intent `operacao_complexa_rebanho` (múltiplas pastagens + animais)
- [x] Sistema de debug extensivo com logs detalhados
- [x] Processamento de pastos mencionados na venda

## 🎨 Design System

### Paleta de Cores
- **Primária**: Verde escuro (agro, sério)
- **Secundária**: Preto e branco
- **Acentos**: Tons de verde

### Componentes UI
- Baseado em **shadcn/ui**
- Design responsivo
- Acessibilidade (ARIA)

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Debugging

Todos os logs estão no console do navegador (F12):
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

## 📝 Notas Importantes

### Persistência Atual
- O sistema atualmente usa **localStorage** para persistência temporária
- Estrutura preparada para migração para backend real (REST API, banco de dados)
- Todos os dados são salvos localmente no navegador

### Integrações Externas
- **OpenRouter API**: Configurada via `VITE_OPENROUTER_API_KEY`
- Modelo padrão: `google/gemini-2.0-flash-lite-001`
- Requer chave de API válida no arquivo `.env`

### Metodologias
- Baseado em metodologias validadas pela **Embrapa**
- Nomenclaturas zootécnicas padronizadas
- Cálculos seguem referências científicas

### Correções e Melhorias Recentes

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
- ✅ Sidebar simplificada (Dashboard, Pecuária, Financeiro, Configurações)

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

## 📋 Status de Integração

**Status Geral**: Sistema 90% funcional e 85% integrado.

### Integrações Funcionando
- ✅ **Financeiro ↔ Rebanho**: 100% (compras/vendas atualizam automaticamente)
- ✅ **Pastagens ↔ Financeiro**: 100% (manutenção/formação atualizam automaticamente)
- ✅ **Pastagens ↔ Rebanho**: 70% (UA calculada, falta associação real de animais)
- ✅ **Agente de IA**: 95% (LLM-centered com function calling)

### Limitações Conhecidas
- ⚠️ Animais não associados diretamente a pastos específicos (distribuição proporcional)
- ⚠️ Validação de pastos na venda poderia ser mais rigorosa

## 🗺️ Roadmap

Consulte o arquivo `roadmap.md` para ver o plano completo de desenvolvimento e próximas fases.

## 📄 Licença

Este projeto é privado.

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Para contribuições, consulte o roadmap e as issues abertas.

---

**Versão**: 0.2.0  
**Última atualização**: Janeiro 2025  
**Status**: Todas as 4 fases principais concluídas. Migração para LLM-centered completa.

### 📈 Próximas Melhorias Planejadas

- [ ] Associação direta de animais com pastos (`pastureId` em animais)
- [ ] Validação de capacidade de pastos ao adicionar animais
- [ ] Movimentação de animais entre pastos
- [ ] Dashboard de pastagens com visualização de animais por pasto
- [ ] Cálculo de UA por pasto baseado em animais reais (não proporcional)

Para mais detalhes sobre melhorias sugeridas, consulte o roadmap.
