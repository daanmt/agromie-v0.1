/**
 * Tipos para o Agente de IA Integrado
 * Pipeline de interpretação e execução de ações
 */

export enum IntentType {
  // Financeiro
  REGISTER_REVENUE = "REGISTER_REVENUE",
  REGISTER_EXPENSE = "REGISTER_EXPENSE",
  REGISTER_INVESTMENT = "REGISTER_INVESTMENT",
  REGISTER_WITHDRAWAL = "REGISTER_WITHDRAWAL",
  VIEW_FINANCIAL_METRICS = "VIEW_FINANCIAL_METRICS",
  
  // Rebanho
  REGISTER_BIRTH = "REGISTER_BIRTH",
  REGISTER_DEATH = "REGISTER_DEATH",
  REGISTER_PURCHASE = "REGISTER_PURCHASE",
  REGISTER_SALE = "REGISTER_SALE",
  REGISTER_WEIGHT = "REGISTER_WEIGHT",
  REGISTER_MOVEMENT = "REGISTER_MOVEMENT",
  VIEW_LIVESTOCK_METRICS = "VIEW_LIVESTOCK_METRICS",
  
  // Pastagens
  REGISTER_PASTURE = "REGISTER_PASTURE",
  REGISTER_FORMATION = "REGISTER_FORMATION",
  REGISTER_REFORM = "REGISTER_REFORM",
  REGISTER_MAINTENANCE = "REGISTER_MAINTENANCE",
  VIEW_PASTURE_BALANCE = "VIEW_PASTURE_BALANCE",
  
  // Geral
  GREETING = "GREETING",
  HELP = "HELP",
  UNKNOWN = "UNKNOWN",
}

export interface ExtractedEntity {
  // Datas
  date?: string; // ISO date string
  dateText?: string; // Texto original da data
  
  // Valores monetários
  amount?: number; // Em centavos
  amountText?: string; // Texto original
  
  // Quantidades
  quantity?: number;
  quantityText?: string;
  
  // Pesos
  weight?: number; // Em gramas
  weightText?: string; // Texto original
  
  // Categorias e descrições
  category?: string;
  description?: string;
  accountName?: string;
  pastureName?: string;
  animalTag?: string;
  
  // Outros
  notes?: string;
  location?: string;
}

export interface ParsedIntent {
  intent: IntentType;
  confidence: number; // 0-1
  entities: ExtractedEntity;
  originalText: string;
}

export interface AIActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface AIResponse {
  intent: IntentType;
  message: string;
  actionResult?: AIActionResult;
  suggestions?: string[];
}

// Base de conhecimento - Nomenclaturas Embrapa
export const EMBRAPA_TERMS = {
  // Categorias zootécnicas
  categories: {
    "vaca": "VACA",
    "vacas": "VACA",
    "novilha": "NOVILHA",
    "novilhas": "NOVILHA",
    "bezerro": "BEZERRO",
    "bezerros": "BEZERRO",
    "bezerra": "BEZERRA",
    "bezerras": "BEZERRA",
    "boi": "BOI_MAGRO", // Padrão para "boi" é boi magro
    "bois": "BOI_MAGRO",
    "boi magro": "BOI_MAGRO",
    "bois magros": "BOI_MAGRO",
    "boi gordo": "BOI_GORDO",
    "bois gordos": "BOI_GORDO",
    "touro": "TOURO",
    "touros": "TOURO",
    "touruno": "TOURUNO",
    "tourunos": "TOURUNO",
  },
  
  // Tipos de pastagem
  pastureTypes: {
    "braquiária": "BRAQUIARIA",
    "braquiaria": "BRAQUIARIA",
    "panicum": "PANICUM",
    "capim elefante": "CAPIM_ELEFANTE",
    "tifton": "TIFTON",
    "nativa": "NATIVA",
  },
  
  // Intents financeiros
  financialIntents: {
    "receita": "REGISTER_REVENUE",
    "receitas": "REGISTER_REVENUE",
    "ganho": "REGISTER_REVENUE",
    "ganhos": "REGISTER_REVENUE",
    "venda": "REGISTER_REVENUE",
    "vendas": "REGISTER_REVENUE",
    "despesa": "REGISTER_EXPENSE",
    "despesas": "REGISTER_EXPENSE",
    "gasto": "REGISTER_EXPENSE",
    "gastos": "REGISTER_EXPENSE",
    "compra": "REGISTER_EXPENSE",
    "compras": "REGISTER_EXPENSE",
    "investimento": "REGISTER_INVESTMENT",
    "investimentos": "REGISTER_INVESTMENT",
    "retirada": "REGISTER_WITHDRAWAL",
    "retiradas": "REGISTER_WITHDRAWAL",
    "pró-labore": "REGISTER_WITHDRAWAL",
    "pro-labore": "REGISTER_WITHDRAWAL",
  },
  
  // Intents rebanho
  livestockIntents: {
    "nascimento": "REGISTER_BIRTH",
    "nascimentos": "REGISTER_BIRTH",
    "nasceu": "REGISTER_BIRTH",
    "nasceram": "REGISTER_BIRTH",
    "morte": "REGISTER_DEATH",
    "mortes": "REGISTER_DEATH",
    "morreu": "REGISTER_DEATH",
    "morreram": "REGISTER_DEATH",
    "pesagem": "REGISTER_WEIGHT",
    "pesagens": "REGISTER_WEIGHT",
    "pesou": "REGISTER_WEIGHT",
    "pesaram": "REGISTER_WEIGHT",
    "peso": "REGISTER_WEIGHT",
  },
  
  // Intents pastagens
  pastureIntents: {
    "pastagem": "REGISTER_PASTURE",
    "pasto": "REGISTER_PASTURE",
    "formação": "REGISTER_FORMATION",
    "formar": "REGISTER_FORMATION",
    "reforma": "REGISTER_REFORM",
    "reformar": "REGISTER_REFORM",
    "adubação": "REGISTER_MAINTENANCE",
    "adubar": "REGISTER_MAINTENANCE",
    "roçada": "REGISTER_MAINTENANCE",
    "roçar": "REGISTER_MAINTENANCE",
  },
} as const;

