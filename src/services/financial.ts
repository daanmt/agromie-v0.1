/**
 * Serviços para o Módulo Financeiro
 * Gerencia plano de contas, lançamentos e cálculos
 */

import { storage, STORAGE_KEYS } from "@/lib/storage";
import type {
  Account,
  FinancialTransaction,
  MonthlyConsolidation,
  AnnualConsolidation,
  FinancialMetrics,
  CashFlow,
} from "@/types/financial";
import { AccountGroup, TransactionType } from "@/types/financial";

// Debug: verificar se AccountGroup está carregado
console.log("DEBUG AccountGroup:", AccountGroup);
if (!AccountGroup) {
  console.error("CRITICAL: AccountGroup is not defined!");
}

// ==================== PLANO DE CONTAS ====================

export const accountService = {
  // Buscar todas as contas
  getAll: (): Account[] => {
    return storage.get<Account[]>(STORAGE_KEYS.FINANCIAL_ACCOUNTS, []);
  },

  // Buscar conta por ID
  getById: (id: string): Account | null => {
    const accounts = accountService.getAll();
    return accounts.find((a) => a.id === id) || null;
  },

  // Buscar contas por grupo
  getByGroup: (group: AccountGroup): Account[] => {
    const accounts = accountService.getAll();
    return accounts.filter((a) => a.group === group && a.active);
  },

  // Criar conta
  create: (account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account => {
    const accounts = accountService.getAll();
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    accounts.push(newAccount);
    storage.set(STORAGE_KEYS.FINANCIAL_ACCOUNTS, accounts);
    return newAccount;
  },

  // Atualizar conta
  update: (id: string, updates: Partial<Account>): Account | null => {
    const accounts = accountService.getAll();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) return null;

    accounts[index] = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FINANCIAL_ACCOUNTS, accounts);
    return accounts[index];
  },

  // Deletar conta (soft delete)
  delete: (id: string): boolean => {
    return accountService.update(id, { active: false }) !== null;
  },

  // Inicializar plano de contas padrão
  initializeDefault: (): void => {
    if (!AccountGroup) {
      console.error("CRITICAL: AccountGroup is not defined!");
      throw new Error("AccountGroup is not defined. Check import in financial.ts");
    }
    
    const existing = accountService.getAll();
    
    if (existing.length > 0) {
      return; // Já inicializado
    }
    
    try {
      const defaultAccounts: Omit<Account, "id" | "createdAt" | "updatedAt">[] = [
        // RECEITAS
        { code: "1.1", name: "Receitas de Vendas", group: AccountGroup.RECEITAS, active: true },
        { code: "1.1.01", name: "Venda de Gado", group: AccountGroup.RECEITAS, parentId: "1.1", active: true },
        { code: "1.1.02", name: "Venda de Leite", group: AccountGroup.RECEITAS, parentId: "1.1", active: true },
        { code: "1.1.03", name: "Venda de Outros Produtos", group: AccountGroup.RECEITAS, parentId: "1.1", active: true },
        { code: "1.2", name: "Outras Receitas", group: AccountGroup.RECEITAS, active: true },
        
        // DESPESAS
        { code: "2.1", name: "Despesas com Rebanho", group: AccountGroup.DESPESAS, active: true },
        { code: "2.1.01", name: "Ração e Suplementos", group: AccountGroup.DESPESAS, parentId: "2.1", active: true },
        { code: "2.1.02", name: "Medicamentos e Vacinas", group: AccountGroup.DESPESAS, parentId: "2.1", active: true },
        { code: "2.1.03", name: "Mão de Obra", group: AccountGroup.DESPESAS, parentId: "2.1", active: true },
        { code: "2.2", name: "Despesas com Pastagens", group: AccountGroup.DESPESAS, active: true },
        { code: "2.2.01", name: "Fertilizantes", group: AccountGroup.DESPESAS, parentId: "2.2", active: true },
        { code: "2.2.02", name: "Sementes", group: AccountGroup.DESPESAS, parentId: "2.2", active: true },
        { code: "2.2.03", name: "Manutenção", group: AccountGroup.DESPESAS, parentId: "2.2", active: true },
        { code: "2.3", name: "Despesas Administrativas", group: AccountGroup.DESPESAS, active: true },
        { code: "2.3.01", name: "Energia Elétrica", group: AccountGroup.DESPESAS, parentId: "2.3", active: true },
        { code: "2.3.02", name: "Combustível", group: AccountGroup.DESPESAS, parentId: "2.3", active: true },
        { code: "2.3.03", name: "Impostos e Taxas", group: AccountGroup.DESPESAS, parentId: "2.3", active: true },
        
        // INVESTIMENTOS
        { code: "3.1", name: "Investimentos em Infraestrutura", group: AccountGroup.INVESTIMENTOS, active: true },
        { code: "3.1.01", name: "Construções", group: AccountGroup.INVESTIMENTOS, parentId: "3.1", active: true },
        { code: "3.1.02", name: "Máquinas e Equipamentos", group: AccountGroup.INVESTIMENTOS, parentId: "3.1", active: true },
        { code: "3.2", name: "Investimentos em Rebanho", group: AccountGroup.INVESTIMENTOS, active: true },
        { code: "3.2.01", name: "Compra de Animais", group: AccountGroup.INVESTIMENTOS, parentId: "3.2", active: true },
        
        // PRÓ-LABORE
        { code: "4.1", name: "Retiradas do Proprietário", group: AccountGroup.PRO_LABORE, active: true },
      ];

      defaultAccounts.forEach((account) => {
        try {
          accountService.create(account);
        } catch (error) {
          console.error(`❌ Erro ao criar conta ${account.code}:`, error);
        }
      });
    } catch (error) {
      console.error(`❌ [FINANCIAL] Erro ao inicializar plano de contas:`, error);
      throw error;
    }
  },
};

// ==================== LANÇAMENTOS ====================

export const transactionService = {
  // Buscar todas as transações
  getAll: (): FinancialTransaction[] => {
    return storage.get<FinancialTransaction[]>(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, []);
  },

  // Buscar transação por ID
  getById: (id: string): FinancialTransaction | null => {
    const transactions = transactionService.getAll();
    return transactions.find((t) => t.id === id) || null;
  },

  // Buscar transações por tipo
  getByType: (type: TransactionType): FinancialTransaction[] => {
    const transactions = transactionService.getAll();
    return transactions.filter((t) => t.type === type);
  },

  // Buscar transações por período
  getByPeriod: (startDate: string, endDate: string): FinancialTransaction[] => {
    const transactions = transactionService.getAll();
    const filtered = transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
    // Log removido - muito verboso
    if (transactions.length > 0 && filtered.length === 0) {
      // Aviso apenas se realmente necessário
      if (import.meta.env.DEV) {
        console.warn(`⚠️ [FINANCIAL] Nenhuma transação no período ${startDate} até ${endDate}`);
      }
    }
    return filtered;
  },

  // Criar lançamento
  create: (
    transaction: Omit<FinancialTransaction, "id" | "createdAt" | "updatedAt" | "accountName">
  ): FinancialTransaction => {
    // Log removido - muito verboso
    const account = accountService.getById(transaction.accountId);
    const transactions = transactionService.getAll();
    const newTransaction: FinancialTransaction = {
      ...transaction,
      accountName: account?.name,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    storage.set(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, transactions);
    // Log removido - muito verboso
    return newTransaction;
  },

  // Atualizar lançamento
  update: (id: string, updates: Partial<FinancialTransaction>): FinancialTransaction | null => {
    const transactions = transactionService.getAll();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const account = updates.accountId
      ? accountService.getById(updates.accountId)
      : accountService.getById(transactions[index].accountId);

    transactions[index] = {
      ...transactions[index],
      ...updates,
      accountName: account?.name || transactions[index].accountName,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, transactions);
    return transactions[index];
  },

  // Deletar lançamento
  delete: (id: string): boolean => {
    const transactions = transactionService.getAll();
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length === transactions.length) return false;
    storage.set(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, filtered);
    return true;
  },
};

// ==================== CÁLCULOS ====================

export const financialCalculations = {
  // Calcular métricas financeiras para um período
  calculateMetrics: (startDate: string, endDate: string): FinancialMetrics => {
    // Log reduzido - apenas resumo final
    const allTransactions = transactionService.getAll();
    const transactions = transactionService.getByPeriod(startDate, endDate);

    const receitas = transactions
      .filter((t) => t.type === TransactionType.RECEITA)
      .reduce((sum, t) => sum + t.amount, 0);

    const despesas = transactions
      .filter((t) => t.type === TransactionType.DESPESA)
      .reduce((sum, t) => sum + t.amount, 0);

    const investimentos = transactions
      .filter((t) => t.type === TransactionType.INVESTIMENTO)
      .reduce((sum, t) => sum + t.amount, 0);

    const retiradas = transactions
      .filter((t) => t.type === TransactionType.RETIRADA)
      .reduce((sum, t) => sum + t.amount, 0);

    const receitaBruta = receitas;
    const custosTotais = despesas;
    const lucroBruto = receitaBruta - custosTotais;
    const margemBruta = receitaBruta > 0 ? (lucroBruto / receitaBruta) * 100 : 0;

    // Despesas operacionais (todas as despesas exceto investimentos)
    const despesasOperacionais = despesas;
    const lucroOperacional = receitaBruta - despesasOperacionais;
    const margemOperacional = receitaBruta > 0 ? (lucroOperacional / receitaBruta) * 100 : 0;

    const lucroLiquido = lucroOperacional - investimentos - retiradas;
    const margemLiquida = receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0;

    // Custo operacional da fazenda (despesas + investimentos)
    const custoOperacionalFazenda = despesas + investimentos;

    const metrics = {
      receitaBruta,
      custosTotais,
      lucroBruto,
      margemBruta,
      despesasOperacionais,
      lucroOperacional,
      margemOperacional,
      investimentos,
      retiradas,
      lucroLiquido,
      margemLiquida,
      custoOperacionalFazenda,
    };

    // Log apenas em modo debug
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_FINANCIAL === "true") {
      console.log(`✅ [FINANCIAL] Métricas calculadas:`, {
        receitaBruta: `${receitaBruta} centavos (R$ ${(receitaBruta / 100).toFixed(2)})`,
        custosTotais: `${custosTotais} centavos (R$ ${(custosTotais / 100).toFixed(2)})`,
        lucroLiquido: `${lucroLiquido} centavos (R$ ${(lucroLiquido / 100).toFixed(2)})`,
        margemLiquida: `${margemLiquida.toFixed(2)}%`
      });
    }

    return metrics;
  },

  // Consolidação mensal
  getMonthlyConsolidation: (year: number, month: number): MonthlyConsolidation => {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    const transactions = transactionService.getByPeriod(startDate, endDate);

    const totalReceitas = transactions
      .filter((t) => t.type === TransactionType.RECEITA)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = transactions
      .filter((t) => t.type === TransactionType.DESPESA)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalInvestimentos = transactions
      .filter((t) => t.type === TransactionType.INVESTIMENTO)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRetiradas = transactions
      .filter((t) => t.type === TransactionType.RETIRADA)
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = totalReceitas - totalDespesas - totalInvestimentos - totalRetiradas;

    return {
      year,
      month,
      totalReceitas,
      totalDespesas,
      totalInvestimentos,
      totalRetiradas,
      saldo,
      transactions,
    };
  },

  // Consolidação anual
  getAnnualConsolidation: (year: number): AnnualConsolidation => {
    const monthlyBreakdown: MonthlyConsolidation[] = [];
    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalInvestimentos = 0;
    let totalRetiradas = 0;

    for (let month = 1; month <= 12; month++) {
      const monthly = financialCalculations.getMonthlyConsolidation(year, month);
      monthlyBreakdown.push(monthly);
      totalReceitas += monthly.totalReceitas;
      totalDespesas += monthly.totalDespesas;
      totalInvestimentos += monthly.totalInvestimentos;
      totalRetiradas += monthly.totalRetiradas;
    }

    const saldo = totalReceitas - totalDespesas - totalInvestimentos - totalRetiradas;

    return {
      year,
      totalReceitas,
      totalDespesas,
      totalInvestimentos,
      totalRetiradas,
      saldo,
      monthlyBreakdown,
    };
  },

  // Fluxo de caixa (últimos N meses)
  getCashFlow: (months: number = 12): CashFlow[] => {
    const today = new Date();
    const cashFlow: CashFlow[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const consolidation = financialCalculations.getMonthlyConsolidation(year, month);

      const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
      ];

      cashFlow.push({
        month: `${year}-${String(month).padStart(2, "0")}`,
        monthName: `${monthNames[month - 1]} ${year}`,
        entradas: consolidation.totalReceitas,
        saidas: consolidation.totalDespesas + consolidation.totalInvestimentos + consolidation.totalRetiradas,
        saldo: consolidation.saldo,
      });
    }

    return cashFlow;
  },
};

// ==================== API PARA OUTROS MÓDULOS ====================

/**
 * Interface para outros módulos registrarem transações automaticamente
 */
export const financialAPI = {
  // Registrar receita (ex: venda de gado)
  registerRevenue: (
    amount: number,
    description: string,
    date: string,
    category?: string
  ): FinancialTransaction => {
    // Buscar conta padrão de receitas ou criar
    const receitasAccounts = accountService.getByGroup(AccountGroup.RECEITAS);
    const accountId = receitasAccounts[0]?.id || accountService.create({
      code: "1.1.01",
      name: "Venda de Gado",
      group: AccountGroup.RECEITAS,
      active: true,
    }).id;

    return transactionService.create({
      type: TransactionType.RECEITA,
      accountId,
      date,
      description,
      amount: Math.round(amount * 100), // Converter para centavos
      category,
    });
  },

  // Registrar despesa (ex: compra de ração)
  registerExpense: (
    amount: number,
    description: string,
    date: string,
    category?: string
  ): FinancialTransaction => {
    const despesasAccounts = accountService.getByGroup(AccountGroup.DESPESAS);
    const accountId = despesasAccounts[0]?.id || accountService.create({
      code: "2.1.01",
      name: "Ração e Suplementos",
      group: AccountGroup.DESPESAS,
      active: true,
    }).id;

    return transactionService.create({
      type: TransactionType.DESPESA,
      accountId,
      date,
      description,
      amount: Math.round(amount * 100),
      category,
    });
  },

  // Registrar investimento (ex: compra de animais)
  registerInvestment: (
    amount: number,
    description: string,
    date: string,
    category?: string
  ): FinancialTransaction => {
    const investimentosAccounts = accountService.getByGroup(AccountGroup.INVESTIMENTOS);
    const accountId = investimentosAccounts[0]?.id || accountService.create({
      code: "3.2.01",
      name: "Compra de Animais",
      group: AccountGroup.INVESTIMENTOS,
      active: true,
    }).id;

    return transactionService.create({
      type: TransactionType.INVESTIMENTO,
      accountId,
      date,
      description,
      amount: Math.round(amount * 100),
      category,
    });
  },
};

