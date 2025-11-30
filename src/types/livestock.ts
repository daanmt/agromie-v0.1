/**
 * Tipos para o Módulo do Rebanho
 * Baseado em metodologias zootécnicas da Embrapa
 */

export enum LivestockCategory {
  VACA = "VACA",
  NOVILHA = "NOVILHA",
  BEZERRO = "BEZERRO",
  BEZERRA = "BEZERRA",
  BOI_MAGRO = "BOI_MAGRO",
  BOI_GORDO = "BOI_GORDO",
  TOURO = "TOURO",
  TOURUNO = "TOURUNO",
}

export enum LivestockEventType {
  NASCIMENTO = "NASCIMENTO",
  MORTE = "MORTE",
  COMPRA = "COMPRA",
  VENDA = "VENDA",
  PESAGEM = "PESAGEM",
  MOVIMENTACAO_INTERNA = "MOVIMENTACAO_INTERNA",
  VACINACAO = "VACINACAO",
  DESMAME = "DESMAME",
}

export interface LivestockCategoryConfig {
  id: string;
  code: string; // Código da categoria (ex: "VACA", "BOI_GORDO")
  name: string; // Nome exibido (ex: "Vaca", "Boi Gordo")
  category: LivestockCategory;
  minAgeMonths?: number; // Idade mínima em meses
  maxAgeMonths?: number; // Idade máxima em meses
  minWeightKg?: number; // Peso mínimo em kg
  maxWeightKg?: number; // Peso máximo em kg
  gender?: "M" | "F"; // Gênero (Macho/Fêmea)
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LivestockAnimal {
  id: string;
  tagNumber?: string; // Número do brinco/identificação
  categoryId: string; // Referência à categoria
  categoryName?: string; // Cache do nome da categoria
  birthDate?: string; // Data de nascimento (ISO)
  purchaseDate?: string; // Data de compra (ISO)
  purchasePrice?: number; // Preço de compra em centavos
  currentWeight?: number; // Peso atual em gramas (para precisão)
  gender: "M" | "F"; // Gênero
  breed?: string; // Raça
  motherId?: string; // ID da mãe (para rastreamento)
  fatherId?: string; // ID do pai (para rastreamento)
  status: "ATIVO" | "VENDIDO" | "MORTO" | "ABATIDO";
  location?: string; // Localização/pasto atual
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LivestockEvent {
  id: string;
  type: LivestockEventType;
  animalId?: string; // ID do animal (opcional para eventos em lote)
  animalTagNumber?: string; // Número do brinco (para referência)
  categoryId: string; // Categoria afetada
  categoryName?: string; // Cache do nome da categoria
  date: string; // ISO date string
  description: string;
  
  // Dados específicos por tipo de evento
  quantity?: number; // Quantidade (para compras/vendas em lote)
  weight?: number; // Peso em gramas
  price?: number; // Preço em centavos (para compras/vendas)
  financialTransactionId?: string; // ID da transação financeira relacionada
  
  // Dados de movimentação
  fromLocation?: string;
  toLocation?: string;
  
  // Dados de vacinação
  vaccineName?: string;
  nextVaccinationDate?: string;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LivestockStock {
  categoryId: string;
  categoryName: string;
  category: LivestockCategory;
  quantity: number; // Quantidade atual
  totalWeight: number; // Peso total em gramas
  averageWeight: number; // Peso médio em gramas
  totalValue: number; // Valor patrimonial em centavos
  averageValue: number; // Valor médio por cabeça em centavos
}

export interface LivestockMetrics {
  totalAnimals: number; // Total de animais ativos
  totalWeight: number; // Peso total em gramas
  averageWeight: number; // Peso médio em gramas
  totalValue: number; // Valor patrimonial total em centavos
  stockByCategory: LivestockStock[]; // Estoque por categoria
  
  // Taxas e indicadores
  birthRate: number; // Taxa de natalidade (%)
  mortalityRate: number; // Taxa de mortalidade (%)
  turnoverRate: number; // Taxa de desfrute (%)
  
  // GMD (Ganho Médio Diário)
  averageGMD: number; // GMD médio em gramas/dia
  
  // Período de análise
  periodStart: string;
  periodEnd: string;
}

export interface WeightEvolution {
  animalId: string;
  animalTagNumber?: string;
  measurements: {
    date: string;
    weight: number; // em gramas
    ageDays?: number; // Idade em dias na pesagem
  }[];
  gmd?: number; // Ganho Médio Diário calculado
}

export interface LivestockMovement {
  id: string;
  animalId: string;
  fromCategoryId: string;
  toCategoryId: string;
  date: string;
  reason: string;
  notes?: string;
  createdAt: string;
}

