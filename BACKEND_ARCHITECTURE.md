# Arquitetura Backend – AgrOmie v1.0

**Arquitetura**: Event-Sourcing + CQRS + PostgreSQL
**Status**: 🔄 Planejada (aguardando implementação)
**Objetivo**: Migração de localStorage para backend robusto e escalável

---

## 📋 Sumário Executivo

Este documento define a arquitetura backend completa do AgrOmie, baseada em **Event-Sourcing** e **CQRS**, otimizada para:

1. **Performance do Dashboard**: 10x mais rápido (<100ms vs 500-1000ms)
2. **Suporte ao Orchestrator LLM-centered**: Atomicidade, auditoria, rollback
3. **Escalabilidade**: Multi-tenancy (1000+ fazendas, 100k+ animais)
4. **Auditoria Total**: Todos os eventos rastreáveis e imutáveis

---

## 🏗️ Visão Geral da Arquitetura

### Stack Tecnológico

**Backend**:
- **Runtime**: Node.js 20+ com TypeScript
- **Framework**: Express.js (API REST)
- **Database**: PostgreSQL 15+
- **ORM**: Drizzle (type-safe, migrations)
- **Authentication**: JWT com refresh tokens
- **Validation**: Zod (compartilhado com frontend)

**Infraestrutura**:
- **Development**: Docker Compose (PostgreSQL local)
- **Production**: Railway, Render, ou Vercel (backend) + Supabase/Neon (database)
- **Monitoring**: Winston (logs) + Sentry (errors)

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript)                          │
│  - Dashboard otimizado                                  │
│  - AI Orchestrator (LLM-centered)                       │
└──────────────────┬──────────────────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────────────────┐
│  Backend API Layer (Express + TypeScript)               │
│  - Authentication & Authorization (JWT)                 │
│  - Command Handlers (write operations)                  │
│  - Query Handlers (read operations)                     │
└──────────────────┬──────────────────────────────────────┘
           ┌───────┴───────┐
           │               │
┌──────────▼─────┐  ┌──────▼──────────────┐
│  Event Store    │  │  Read Models        │
│  (Write Side)   │  │  (Read Side)        │
│                 │  │                     │
│  - livestock_   │  │  - animals_view     │
│    events       │  │  - kpi_financial_   │
│  - financial_   │  │    monthly          │
│    events       │  │  - kpi_livestock_   │
│  - pasture_     │  │    monthly          │
│    events       │  │  - kpi_pasture_     │
│                 │  │    monthly          │
└─────────────────┘  └─────────────────────┘
           │                  │
           └────────┬─────────┘
                    │
          ┌─────────▼─────────┐
          │   PostgreSQL 15+  │
          │   - Event log      │
          │   - Projections    │
          │   - Entidades      │
          └───────────────────┘
```

---

## 🎯 Princípios da Arquitetura

### 1. Event-Sourcing

**Conceito**: Todas as operações do sistema (compras, vendas, nascimentos, despesas) geram **eventos imutáveis** que são armazenados permanentemente no Event Store.

**Exemplo de Fluxo**:
```typescript
// Usuário: "Comprei 100 bezerros por R$ 120.000"

// 1. Command Handler recebe comando
const command: PurchaseAnimalCommand = {
  farmId: 'farm-123',
  userId: 'user-456',
  quantity: 100,
  categoryId: 'category-bezerros',
  priceTotal: 12000000, // centavos
  date: '2025-01-15',
  pastureId: 'pasture-789'
};

// 2. Eventos são criados
const events = [
  {
    type: 'AnimalsPurchased',
    aggregateType: 'livestock',
    aggregateId: 'batch-abc',
    data: { quantity: 100, categoryId: '...', priceTotal: 12000000 }
  },
  {
    type: 'InvestmentRecorded',
    aggregateType: 'financial',
    aggregateId: 'transaction-def',
    data: { value: 12000000, accountId: '...' }
  }
];

// 3. Eventos são persistidos atomicamente
await eventStore.appendBatch(events);

// 4. Projections são atualizadas
await projectionManager.rebuild(['animals', 'transactions', 'kpi_livestock_monthly']);
```

**Benefícios**:
- ✅ **Auditoria total**: Histórico completo de todas as operações
- ✅ **Rastreabilidade**: Quem fez o quê, quando e por quê
- ✅ **Replay**: Reconstruir estado a qualquer momento
- ✅ **Análise temporal**: Entender evolução do rebanho/financeiro ao longo do tempo

### 2. CQRS (Command Query Responsibility Segregation)

**Conceito**: Separação clara entre operações de **escrita** (commands) e **leitura** (queries).

**Write Side (Commands)**:
- Recebe comandos do usuário/orchestrator
- Valida regras de negócio
- Cria eventos imutáveis
- Persiste no Event Store

**Read Side (Queries)**:
- Consulta projeções otimizadas (materialized views)
- Retorna dados rapidamente (<100ms)
- Não modifica estado

**Exemplo**:
```typescript
// WRITE: Command Handler
class PurchaseAnimalCommandHandler {
  async handle(command: PurchaseAnimalCommand): Promise<void> {
    // 1. Validar comando
    await this.validateCommand(command);

    // 2. Criar eventos
    const events = this.createEvents(command);

    // 3. Persistir eventos
    await this.eventStore.appendBatch(events);

    // 4. Atualizar projeções (async)
    this.projectionManager.rebuild(['animals', 'kpi_livestock_monthly']);
  }
}

// READ: Query Handler
class GetLivestockMetricsQueryHandler {
  async handle(query: GetLivestockMetricsQuery): Promise<LivestockMetrics> {
    // Consulta direta na materialized view (rápido!)
    return await db.query(`
      SELECT * FROM kpi_livestock_monthly
      WHERE farm_id = $1 AND month = $2
    `, [query.farmId, query.month]);
  }
}
```

### 3. Projections (Read Models)

**Conceito**: Views materializadas construídas a partir dos eventos, otimizadas para leitura.

**Tipos de Projeções**:
1. **Entidades**: Estado atual (animais, transações, pastos)
2. **KPIs**: Métricas agregadas (mensais, anuais)
3. **Dashboards**: Dados pré-calculados para visualização

**Atualização**:
- **Incremental**: Após cada evento (rápido)
- **Full Rebuild**: Replay completo de eventos (manutenção)

---

## 🗄️ Estrutura do Banco de Dados

### Schema Completo

#### 1. Núcleo – Usuários e Fazendas

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de fazendas (multi-tenancy)
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permissões (multi-usuário por fazenda)
CREATE TABLE user_farm_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  farm_id UUID NOT NULL REFERENCES farms(id),
  role TEXT NOT NULL, -- 'owner', 'admin', 'viewer'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, farm_id)
);
```

#### 2. Rebanho – Entidades Principais

```sql
-- Categorias zootécnicas
CREATE TABLE livestock_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  name TEXT NOT NULL,
  ua_per_animal NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Animais individuais (estado atual)
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  tag_number TEXT, -- brinco
  category_id UUID NOT NULL REFERENCES livestock_categories(id),
  sex TEXT, -- 'M', 'F'
  birth_date DATE,
  purchase_date DATE,
  weight_current NUMERIC(8,2), -- kg
  pasture_id UUID REFERENCES pastures(id),
  status TEXT NOT NULL, -- 'active', 'sold', 'dead'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lotes de compra (opcional mas recomendado)
CREATE TABLE livestock_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  purchase_date DATE NOT NULL,
  quantity_initial INTEGER NOT NULL,
  price_total NUMERIC(12,2) NOT NULL,
  category_id UUID NOT NULL REFERENCES livestock_categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pesagens
CREATE TABLE weighings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  animal_id UUID REFERENCES animals(id),
  batch_id UUID REFERENCES livestock_batches(id),
  weight NUMERIC(8,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Pastagens

```sql
-- Áreas de pasto
CREATE TABLE pastures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  name TEXT NOT NULL,
  area_ha NUMERIC(10,2) NOT NULL,
  capacity_ua_per_ha NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Manejo de pastagens
CREATE TABLE pasture_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pasture_id UUID NOT NULL REFERENCES pastures(id),
  farm_id UUID NOT NULL REFERENCES farms(id),
  type TEXT NOT NULL, -- 'fertilização', 'roçada', 'formação', 'reforma', 'manutenção'
  cost NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Financeiro

```sql
-- Plano de contas
CREATE TABLE accounts_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  type TEXT NOT NULL, -- 'expense', 'revenue', 'investment', 'salary'
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transações financeiras (estado atual)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  account_id UUID NOT NULL REFERENCES accounts_plan(id),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL, -- centavos
  quantity INTEGER, -- para compras/vendas de animais
  link_event_id UUID, -- ligação com evento do rebanho/pasto
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Event Store (Eventos Imutáveis)

```sql
-- Eventos do rebanho
CREATE TABLE livestock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  animal_id UUID REFERENCES animals(id),
  batch_id UUID REFERENCES livestock_batches(id),
  type TEXT NOT NULL, -- 'birth', 'purchase', 'sale', 'death', 'move', 'weighing', 'inventory'
  quantity INTEGER,
  value_total NUMERIC(12,2),
  pasture_from_id UUID REFERENCES pastures(id),
  pasture_to_id UUID REFERENCES pastures(id),
  weight NUMERIC(8,2),
  date DATE NOT NULL,
  metadata JSONB, -- dados adicionais flexíveis
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Eventos financeiros
CREATE TABLE financial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  transaction_id UUID REFERENCES transactions(id),
  type TEXT NOT NULL, -- 'receita', 'despesa', 'investimento', 'retirada'
  account_id UUID NOT NULL REFERENCES accounts_plan(id),
  value NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  metadata JSONB,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Eventos de pastagens
CREATE TABLE pasture_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id),
  pasture_id UUID NOT NULL REFERENCES pastures(id),
  type TEXT NOT NULL, -- 'formação', 'reforma', 'manutenção', 'fertilização', 'roçada'
  cost NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL,
  metadata JSONB,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Materialized Views (KPIs Pré-calculados)

```sql
-- KPIs Financeiros Mensais
CREATE MATERIALIZED VIEW kpi_financial_monthly AS
SELECT
  farm_id,
  DATE_TRUNC('month', date) as month,
  SUM(CASE WHEN account_type = 'revenue' THEN value ELSE 0 END) as receita_total,
  SUM(CASE WHEN account_type = 'expense' THEN value ELSE 0 END) as despesas_total,
  SUM(CASE WHEN account_type = 'investment' THEN value ELSE 0 END) as investimentos_total,
  SUM(CASE WHEN account_type = 'salary' THEN value ELSE 0 END) as retiradas_total,
  -- Margens calculadas
  (SUM(CASE WHEN account_type = 'revenue' THEN value ELSE 0 END) -
   SUM(CASE WHEN account_type IN ('expense', 'investment') THEN value ELSE 0 END)) as lucro_liquido,
  CASE
    WHEN SUM(CASE WHEN account_type = 'revenue' THEN value ELSE 0 END) > 0 THEN
      (SUM(CASE WHEN account_type = 'revenue' THEN value ELSE 0 END) -
       SUM(CASE WHEN account_type IN ('expense', 'investment') THEN value ELSE 0 END)) * 100.0 /
      SUM(CASE WHEN account_type = 'revenue' THEN value ELSE 0 END)
    ELSE 0
  END as margem_liquida
FROM transactions t
JOIN accounts_plan ap ON t.account_id = ap.id
GROUP BY farm_id, month;

-- Índice para consultas rápidas
CREATE INDEX idx_kpi_financial_monthly_farm_month ON kpi_financial_monthly(farm_id, month DESC);

-- KPIs do Rebanho Mensais
CREATE MATERIALIZED VIEW kpi_livestock_monthly AS
SELECT
  farm_id,
  DATE_TRUNC('month', date) as month,
  COUNT(DISTINCT animal_id) FILTER (WHERE type = 'birth') as natalidade,
  COUNT(DISTINCT animal_id) FILTER (WHERE type = 'death') as mortalidade,
  COUNT(DISTINCT animal_id) FILTER (WHERE type = 'sale') as desfrute,
  AVG(weight) FILTER (WHERE type = 'weighing') as peso_medio,
  SUM(quantity) FILTER (WHERE type = 'purchase') as compras,
  SUM(quantity) FILTER (WHERE type = 'sale') as vendas,
  SUM(value_total) FILTER (WHERE type = 'purchase') as valor_compras,
  SUM(value_total) FILTER (WHERE type = 'sale') as valor_vendas
FROM livestock_events
GROUP BY farm_id, month;

CREATE INDEX idx_kpi_livestock_monthly_farm_month ON kpi_livestock_monthly(farm_id, month DESC);

-- KPIs de Pastagens Mensais
CREATE MATERIALIZED VIEW kpi_pasture_monthly AS
SELECT
  farm_id,
  DATE_TRUNC('month', date) as month,
  SUM(CASE WHEN type IN ('formação', 'reforma') THEN cost ELSE 0 END) as investimentos_pastagem,
  SUM(CASE WHEN type IN ('manutenção', 'fertilização', 'roçada') THEN cost ELSE 0 END) as despesas_pastagem,
  COUNT(DISTINCT pasture_id) as pastures_manejadas
FROM pasture_events
GROUP BY farm_id, month;

CREATE INDEX idx_kpi_pasture_monthly_farm_month ON kpi_pasture_monthly(farm_id, month DESC);
```

#### 7. Índices para Performance

```sql
-- Índices de busca rápida
CREATE INDEX idx_animals_farm_status ON animals(farm_id, status);
CREATE INDEX idx_animals_pasture ON animals(pasture_id) WHERE status = 'active';
CREATE INDEX idx_transactions_farm_date ON transactions(farm_id, date DESC);
CREATE INDEX idx_events_livestock_farm_date ON livestock_events(farm_id, date DESC);
CREATE INDEX idx_events_financial_farm_date ON financial_events(farm_id, date DESC);
CREATE INDEX idx_events_pasture_farm_date ON pasture_events(farm_id, date DESC);

-- Índice de multi-tenancy (crítico para segurança)
CREATE INDEX idx_farms_owner ON farms(owner_id);
CREATE INDEX idx_user_farm_permissions_user ON user_farm_permissions(user_id);
```

---

## 🔐 Segurança e Multi-Tenancy

### Row-Level Security (RLS)

PostgreSQL RLS garante isolamento de dados por fazenda:

```sql
-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_events ENABLE ROW LEVEL SECURITY;
-- ... demais tabelas

-- Policy: Usuário só vê dados das suas fazendas
CREATE POLICY animals_farm_isolation ON animals
  USING (farm_id IN (
    SELECT farm_id FROM user_farm_permissions
    WHERE user_id = current_setting('app.user_id')::UUID
  ));
```

### Middleware de Autorização

```typescript
// Middleware Express para garantir farmId em todas as queries
export const ensureFarmAccess: RequestHandler = async (req, res, next) => {
  const userId = req.user.id; // do JWT
  const farmId = req.params.farmId || req.body.farmId;

  const hasAccess = await db.query(`
    SELECT 1 FROM user_farm_permissions
    WHERE user_id = $1 AND farm_id = $2
  `, [userId, farmId]);

  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied to this farm' });
  }

  next();
};
```

---

## 📡 API REST Endpoints

### Authentication

```
POST   /api/auth/register      - Criar usuário
POST   /api/auth/login         - Login (retorna JWT)
POST   /api/auth/refresh       - Refresh token
GET    /api/auth/me            - Usuário atual
POST   /api/auth/logout        - Logout
```

### Livestock (Rebanho)

**Commands (Write)**:
```
POST   /api/livestock/purchase         - Registrar compra de animais
POST   /api/livestock/sale             - Registrar venda de animais
POST   /api/livestock/birth            - Registrar nascimento
POST   /api/livestock/death            - Registrar morte
POST   /api/livestock/weighing         - Registrar pesagem
POST   /api/livestock/inventory        - Inventário (sem compra)
POST   /api/livestock/move             - Movimentar animais entre pastos
```

**Queries (Read)**:
```
GET    /api/livestock/animals          - Listar animais (filtros opcionais)
GET    /api/livestock/stock            - Estoque por categoria
GET    /api/livestock/metrics          - Métricas (GMD, natalidade, etc.)
GET    /api/livestock/events           - Histórico de eventos
```

### Financial (Financeiro)

**Commands (Write)**:
```
POST   /api/financial/transaction      - Criar transação
PUT    /api/financial/transaction/:id  - Atualizar transação
DELETE /api/financial/transaction/:id  - Deletar transação
```

**Queries (Read)**:
```
GET    /api/financial/transactions     - Listar transações (filtros)
GET    /api/financial/metrics          - Métricas financeiras
GET    /api/financial/cashflow         - Fluxo de caixa (12 meses)
GET    /api/financial/accounts         - Plano de contas
```

### Pasture (Pastagens)

**Commands (Write)**:
```
POST   /api/pasture/create             - Criar pasto
PUT    /api/pasture/:id                - Atualizar pasto
POST   /api/pasture/management         - Registrar manejo
```

**Queries (Read)**:
```
GET    /api/pasture/list               - Listar pastos
GET    /api/pasture/balance            - Balanço de lotação
GET    /api/pasture/metrics            - Métricas de pastagens
```

### Dashboard (KPIs)

```
GET    /api/dashboard/metrics          - Todas as métricas (financeiro + rebanho + pastagem)
GET    /api/dashboard/kpi/financial    - KPIs financeiros (últimos 12 meses)
GET    /api/dashboard/kpi/livestock    - KPIs do rebanho (últimos 12 meses)
GET    /api/dashboard/kpi/pasture      - KPIs de pastagens (últimos 12 meses)
```

---

## 🔄 Fluxo de Operação Completo

### Exemplo: Compra de 100 Bezerros

**1. Frontend → API**:
```typescript
// Usuário via chat: "Comprei 100 bezerros por 120 mil"
// Orchestrator extrai intent e chama API

await apiClient.purchaseAnimals({
  farmId: 'farm-123',
  quantity: 100,
  categoryId: 'category-bezerros',
  pricePerHead: 120000, // R$ 1.200 por cabeça (centavos)
  date: '2025-01-15',
  pastureId: 'pasture-789'
});
```

**2. API → Command Handler**:
```typescript
class PurchaseAnimalCommandHandler {
  async handle(command: PurchaseAnimalCommand): Promise<void> {
    // Validar comando
    await this.validate(command);

    // Criar eventos
    const batchId = uuid();
    const transactionId = uuid();

    const events = [
      {
        type: 'AnimalsPurchased',
        aggregateType: 'livestock',
        aggregateId: batchId,
        farmId: command.farmId,
        userId: command.userId,
        data: {
          batchId,
          quantity: 100,
          categoryId: command.categoryId,
          priceTotal: 12000000,
          date: command.date,
          pastureId: command.pastureId
        }
      },
      {
        type: 'InvestmentRecorded',
        aggregateType: 'financial',
        aggregateId: transactionId,
        farmId: command.farmId,
        userId: command.userId,
        data: {
          transactionId,
          accountId: 'account-investments',
          value: 12000000,
          description: 'Compra de 100 bezerros',
          date: command.date,
          linkEventId: batchId
        }
      }
    ];

    // Persistir eventos (atomic)
    await this.eventStore.appendBatch(events);

    // Trigger projection rebuild (async)
    this.projectionManager.rebuild([
      'livestock_batches',
      'animals',
      'transactions',
      'kpi_livestock_monthly',
      'kpi_financial_monthly'
    ]);
  }
}
```

**3. Event Store → Projections**:
```typescript
// AnimalsProjection aplica evento
class AnimalsProjection {
  async apply(event: Event): Promise<void> {
    if (event.type === 'AnimalsPurchased') {
      // Criar lote
      await db.livestock_batches.create({
        id: event.data.batchId,
        farm_id: event.farmId,
        purchase_date: event.data.date,
        quantity_initial: event.data.quantity,
        price_total: event.data.priceTotal,
        category_id: event.data.categoryId
      });

      // Criar animais individuais
      const animals = Array(event.data.quantity).fill(null).map(() => ({
        farm_id: event.farmId,
        category_id: event.data.categoryId,
        purchase_date: event.data.date,
        pasture_id: event.data.pastureId,
        status: 'active'
      }));

      await db.animals.batchInsert(animals);
    }
  }
}

// TransactionsProjection aplica evento
class TransactionsProjection {
  async apply(event: Event): Promise<void> {
    if (event.type === 'InvestmentRecorded') {
      await db.transactions.create({
        id: event.data.transactionId,
        farm_id: event.farmId,
        account_id: event.data.accountId,
        date: event.data.date,
        description: event.data.description,
        value: event.data.value,
        quantity: 100,
        link_event_id: event.data.linkEventId
      });
    }
  }
}
```

**4. Dashboard Atualizado**:
```typescript
// Frontend consulta métricas atualizadas
const metrics = await apiClient.getDashboardMetrics();

// Resposta instantânea (<100ms) das materialized views
{
  livestock: {
    totalAnimals: 100,
    totalValue: 12000000,
    uaTotal: 45.0
  },
  financial: {
    receitaBruta: 0,
    custosTotais: 0,
    investimentos: 12000000,
    lucroLiquido: -12000000
  },
  pasture: {
    totalArea: 50.0,
    stockingRate: 90.0,
    status: 'IDEAL'
  }
}
```

---

## 🚀 Plano de Implementação

### Fase 5.1: Setup Backend (2 semanas)

**Entregas**:
- Estrutura do projeto `/backend`
- PostgreSQL configurado (Docker Compose)
- Schema completo (entidades + events + views)
- Migrations com Drizzle
- Environment setup

**Estrutura de Diretórios**:
```
/backend
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── db/
│   │   ├── schema.sql
│   │   └── migrations/
│   ├── models/
│   │   ├── entities/
│   │   ├── events/
│   │   └── projections/
│   ├── services/
│   │   ├── command-handlers/
│   │   ├── query-handlers/
│   │   └── event-store/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── livestock.ts
│   │   ├── financial.ts
│   │   └── pasture.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error-handler.ts
│   └── server.ts
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

### Fase 5.2: API REST + Authentication (2 semanas)

**Entregas**:
- 27+ endpoints REST funcionais
- JWT Authentication (login, register, refresh)
- Middleware de autorização (farm-based)
- Swagger documentation
- Postman collection

### Fase 5.3: Event-Sourcing Core (2 semanas)

**Entregas**:
- Event Store implementation
- Command Handlers (purchase, sale, birth, etc.)
- Query Handlers (getAnimals, getMetrics, etc.)
- Projection Manager (rebuild, apply)
- Unit tests (>80% coverage)

### Fase 5.4: Projections (1 semana)

**Entregas**:
- AnimalsProjection
- TransactionsProjection
- KPIFinancialProjection
- KPILivestockProjection
- KPIPastureProjection
- Refresh automático após eventos

### Fase 5.5: Frontend Integration (1 semana)

**Entregas**:
- API Client (`src/lib/api-client.ts`)
- Substituir storage calls por API
- Dashboard usando projeções (<100ms)
- Error handling e loading states

### Fase 5.6: Orchestrator Integration (1 semana)

**Entregas**:
- Atualizar `ai-tools.ts` para usar API
- Tool `executeIntent` → API endpoints
- Tool `queryStorage` → API queries
- WebSocket para updates em tempo real (opcional)

### Fase 5.7: Migration Tool (1 semana)

**Entregas**:
- Script de migração localStorage → PostgreSQL
- Interface de migração no frontend
- Validação de dados migrados
- Backup automático antes da migração

### Fase 5.8: Deployment + Monitoring (1 semana)

**Entregas**:
- Deploy backend (Railway, Render, ou Vercel)
- Deploy database (Supabase, Neon, ou Railway)
- Monitoring (Winston + Sentry)
- Backup automático configurado
- SSL/HTTPS configurado

---

## 📊 Métricas de Sucesso

### Performance

- ✅ **Dashboard load time**: <100ms (vs 500-1000ms atual)
- ✅ **API response time p95**: <200ms
- ✅ **Materialized view refresh**: <5s
- ✅ **Concurrent users**: 100+ simultâneos

### Funcional

- ✅ **Endpoints funcionais**: 27+ endpoints REST
- ✅ **Autenticação JWT**: Login, register, refresh
- ✅ **Event-sourcing**: Append + rebuild operacionais
- ✅ **Projections**: Atualizadas em tempo real
- ✅ **Frontend integrado**: 100% dos services usando API
- ✅ **Orchestrator integrado**: Tools usando API

### Segurança

- ✅ **Row-level security**: RLS habilitado em todas as tabelas
- ✅ **Farm isolation**: farmId em todas as queries
- ✅ **JWT tokens**: Access + refresh tokens
- ✅ **Rate limiting**: Proteção contra abuse

### Escalabilidade

- ✅ **Multi-tenancy**: 1000+ fazendas
- ✅ **Animais**: 100,000+ animais
- ✅ **Eventos**: 1M+ eventos no event log
- ✅ **Uptime**: >99.9%

---

## ⚠️ Riscos e Mitigações

### Risco 1: Migração corrompe dados
- **Mitigação**: Backup completo do localStorage antes de migrar
- **Rollback**: Restaurar localStorage automaticamente

### Risco 2: Performance pior que localStorage
- **Mitigação**: Materialized views, caching agressivo, índices otimizados

### Risco 3: Orchestrator quebra com API
- **Mitigação**: Retry logic, fallback offline, queue async

### Risco 4: Multi-tenancy vazamento de dados
- **Mitigação**: RLS no PostgreSQL, farmId em todas as queries, testes de segurança

---

## 🔗 Referências

- **Roadmap do Projeto**: `roadmap.md` (Fase 5)
- **README Principal**: `README.md` (seção Arquitetura Backend)
- **Event-Sourcing Pattern**: Martin Fowler - Event Sourcing
- **CQRS Pattern**: Greg Young - CQRS Documents
- **PostgreSQL Best Practices**: PostgreSQL Performance Tuning

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0
**Status**: 🔄 Aguardando implementação
