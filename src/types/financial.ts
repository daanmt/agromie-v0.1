/**
 * Tipos para o Módulo Financeiro
 * Baseado em Controlpec e CUSTObov da Embrapa
 */

export enum AccountGroup {
  RECEITAS = "RECEITAS",
  DESPESAS = "DESPESAS",
  INVESTIMENTOS = "INVESTIMENTOS",
  PRO_LABORE = "PRO_LABORE",
}

export enum TransactionType {
  RECEITA = "RECEITA",
  DESPESA = "DESPESA",
  INVESTIMENTO = "INVESTIMENTO",
  RETIRADA = "RETIRADA",
}

export interface Account {
  id: string;
  code: string; // Código do plano de contas (ex: "1.1.01")
  name: string;
  group: AccountGroup;
  parentId?: string; // Para hierarquia
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  accountId: string; // Referência ao plano de contas
  accountName?: string; // Cache do nome da conta
  date: string; // ISO date string
  description: string;
  amount: number; // Valor em centavos (para precisão)
  category?: string; // Categoria adicional (ex: "Venda de Gado", "Compra de Ração")
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyConsolidation {
  year: number;
  month: number; // 1-12
  totalReceitas: number;
  totalDespesas: number;
  totalInvestimentos: number;
  totalRetiradas: number;
  saldo: number;
  transactions: FinancialTransaction[];
}

export interface AnnualConsolidation {
  year: number;
  totalReceitas: number;
  totalDespesas: number;
  totalInvestimentos: number;
  totalRetiradas: number;
  saldo: number;
  monthlyBreakdown: MonthlyConsolidation[];
}

export interface FinancialMetrics {
  receitaBruta: number;
  custosTotais: number;
  lucroBruto: number;
  margemBruta: number; // %
  despesasOperacionais: number;
  lucroOperacional: number;
  margemOperacional: number; // %
  investimentos: number;
  retiradas: number;
  lucroLiquido: number;
  margemLiquida: number; // %
  custoOperacionalFazenda: number;
}

export interface CashFlow {
  month: string; // "YYYY-MM"
  monthName: string; // "Janeiro 2024"
  entradas: number;
  saidas: number;
  saldo: number;
}

