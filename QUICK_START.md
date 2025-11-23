# AgrOmie - Quick Start Guide

## 🚀 Começando

### 1. Instalação e Setup

```bash
# Clonar e instalar
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 🔐 Autenticação

### Primeira Vez - Criar Conta

1. Abra http://localhost:5173
2. Clique em "Criar conta" na página de login
3. Preencha:
   - Nome completo
   - Email
   - Senha (mínimo 8 caracteres)
4. Concorde com os termos
5. Clique "Criar Conta"

### Fluxo de Login

```
Página Inicial → Sem autenticação? → Redireciona para /login
                         ↓
                    Login page
                         ↓
        Insira email/senha e clique "Entrar"
                         ↓
            ✅ Credenciais corretas → Dashboard
            ❌ Credenciais incorretas → Erro
```

### Recuperar Senha

1. Na página de login, clique "Esqueceu a senha?"
2. Digite seu email
3. Verifique sua caixa de entrada
4. Clique no link enviado para resetar

---

## 📱 Usando a Aplicação

### Estrutura de Dados

```
Usuário (auth)
    ↓
Propriedades (fazendas)
    ├── Lavouras (plantios de culturas)
    ├── Pecuária (animais e vacinações)
    ├── Insumos (fertilizantes, sementes, etc)
    ├── Financeiro (receitas e despesas)
    └── Rastreabilidade (lotes de produção)
```

### Fluxo Típico

#### 1. Criar Propriedade
```javascript
// Usando o hook
const { createProperty } = useProperties();

await createProperty.mutateAsync({
  name: "Fazenda São João",
  location: "Região Centro",
  total_area_hectares: 150,
  property_type: "média"
});
```

#### 2. Adicionar Animal
```javascript
// Usando o hook
const { createAnimal } = useAnimals(propertyId);

await createAnimal.mutateAsync({
  property_id: propertyId,
  livestock_type_id: livestockTypeId,
  identification: "BOV-001",
  name: "Betânia",
  birth_date: "2022-05-15",
  acquisition_cost: 5000,
  status: "ativo"
});
```

#### 3. Registrar Transação Financeira
```javascript
// Usando o hook
const { createTransaction } = useFinancialTransactions(propertyId);

await createTransaction.mutateAsync({
  property_id: propertyId,
  category_id: categoryId,
  description: "Venda de Soja - Lote 001",
  amount: 50000,
  type: "receita",
  transaction_date: new Date(),
  payment_method: "transferência",
  status: "pago"
});
```

#### 4. Registrar Plantio
```javascript
// Usando o hook
const { createPlanting } = usePlantings(propertyId);

await createPlanting.mutateAsync({
  property_id: propertyId,
  crop_id: cropId,
  field_name: "Talhão 1",
  area_hectares: 50,
  planting_date: "2024-10-15",
  expected_harvest_date: "2025-02-20",
  phase: "plantio",
  status: "ativo"
});
```

---

## 🤖 Assistente de IA

### Como Usar

1. Clique no ícone de chat no canto inferior direito
2. Digite sua pergunta ou comando
3. A IA responderá sobre o sistema ou ajudará com operações

### Exemplos de Comandos

```
"Qual é o estado do meu rebanho?"
"Adicione uma transação de venda"
"Mostre meus alertas"
"Como faço para vacinar um animal?"
"Qual é a produtividade média das minhas lavouras?"
```

---

## 📊 Hooks Disponíveis

### useProperties()
```javascript
const { properties, isLoading, createProperty, updateProperty, deleteProperty }
  = useProperties();
```

### useAnimals(propertyId)
```javascript
const { animals, createAnimal, updateAnimal, deleteAnimal, recordVaccination }
  = useAnimals(propertyId);
```

### useFinancialTransactions(propertyId)
```javascript
const { transactions, summary, createTransaction, updateTransaction, deleteTransaction }
  = useFinancialTransactions(propertyId);
// summary.totalRevenue, summary.totalExpenses, summary.netProfit, summary.marginPercentage
```

### usePlantings(propertyId)
```javascript
const { plantings, createPlanting, updatePlanting, deletePlanting }
  = usePlantings(propertyId);
```

### useSupplies(propertyId)
```javascript
const { supplies, categories, createSupply, updateSupply, deleteSupply }
  = useSupplies(propertyId);
```

---

## 🔒 Segurança e Permissões

### RLS em Ação

- Usuário só vê suas propriedades
- Não pode acessar dados de outros usuários
- Banco de dados garante isolamento

```javascript
// Esta query só retorna propriedades do usuário autenticado
const { data } = await supabase
  .from('properties')
  .select('*');
  // RLS automaticamente filtra: user_id = auth.uid()
```

### Logout
```javascript
const { signOut } = useAuth();
await signOut();
// Limpa sessão e localStorage
// Redireciona para login
```

---

## 🔌 Integração WhatsApp (n8n)

### Webhook Endpoint
```
POST https://seu-projeto.supabase.co/functions/v1/whatsapp-webhook

GET https://seu-projeto.supabase.co/functions/v1/whatsapp-webhook?
  hub.mode=subscribe&
  hub.challenge=TOKEN&
  hub.verify_token=VERIFY_TOKEN
```

### Fluxo n8n Recomendado

```
WhatsApp Message
    ↓
[n8n] Webhook recebe
    ↓
[n8n] Extrai texto
    ↓
[n8n] Chama AI Assistant
    ↓
[n8n] Processa resposta
    ↓
[n8n] Envia para WhatsApp
```

### Exemplo de Payload

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "text": "Qual é a situação do meu rebanho?",
          "type": "text",
          "timestamp": 1700000000,
          "messageId": "wamid.xxx"
        }]
      }
    }]
  }]
}
```

---

## 📈 Estrutura de Dados

### Propriedade
```javascript
{
  id: UUID,
  user_id: UUID (owner),
  name: string,
  location: string,
  total_area_hectares: number,
  property_type: 'pequena' | 'média' | 'grande',
  status: 'ativo' | 'inativo' | 'planejado',
  created_at: timestamp,
  updated_at: timestamp
}
```

### Animal
```javascript
{
  id: UUID,
  property_id: UUID,
  livestock_type_id: UUID,
  identification: string (único),
  name: string,
  birth_date: date,
  current_weight_kg: number,
  status: 'ativo' | 'vendido' | 'morto' | 'descartado',
  sale_price: number,
  sale_date: date
}
```

### Transação Financeira
```javascript
{
  id: UUID,
  property_id: UUID,
  category_id: UUID,
  description: string,
  amount: number,
  type: 'receita' | 'despesa',
  transaction_date: date,
  payment_date: date,
  payment_method: 'dinheiro' | 'cheque' | 'transferência' | 'débito' | 'crédito' | 'pix',
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado'
}
```

### Plantio
```javascript
{
  id: UUID,
  property_id: UUID,
  crop_id: UUID,
  field_name: string,
  area_hectares: number,
  planting_date: date,
  expected_harvest_date: date,
  productivity_percentage: number,
  phase: 'preparação' | 'plantio' | 'crescimento' | 'floração' | 'enchimento' | 'colheita' | 'concluído',
  status: 'ativo' | 'finalizado' | 'cancelado'
}
```

---

## 🐛 Troubleshooting

### "Não consigo fazer login"
- Certifique-se de ter criado a conta
- Verifique se email/senha estão corretos
- Limpe cache do navegador

### "Dados não aparecem"
- Verifique se tem propriedade criada
- Confirme que está autenticado
- Abra DevTools → Console para ver erros

### "Erro de permissão"
- Pode ser RLS bloqueando acesso
- Verifique se dados pertencem a seu usuário
- Tente logout/login novamente

### "WhatsApp webhook não funciona"
- Verifique token de verificação
- Confirme URL pública está acessível
- Teste com curl: `curl "URL?hub.mode=subscribe&hub.verify_token=TOKEN"`

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Última atualização**: Nov 23, 2025
**Versão**: 1.0
