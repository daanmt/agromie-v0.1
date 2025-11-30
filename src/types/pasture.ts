/**
 * Tipos para o Módulo de Pastagens
 * Baseado em metodologias de manejo de pastagens
 */

export enum PastureType {
  BRAQUIARIA = "BRAQUIARIA",
  PANICUM = "PANICUM",
  CAPIM_ELEFANTE = "CAPIM_ELEFANTE",
  TIFTON = "TIFTON",
  NATIVA = "NATIVA",
  OUTRA = "OUTRA",
}

export enum PastureStatus {
  EM_FORMACAO = "EM_FORMACAO",
  PRODUZINDO = "PRODUZINDO",
  EM_DESCANSO = "EM_DESCANSO",
  DEGRADADA = "DEGRADADA",
  EM_REFORMA = "EM_REFORMA",
}

export enum ManagementType {
  FORMACAO = "FORMACAO",
  REFORMA = "REFORMA",
  ADUBACAO = "ADUBACAO",
  ROÇADA = "ROÇADA",
  IRRIGACAO = "IRRIGACAO",
  CONTROLE_PRAGAS = "CONTROLE_PRAGAS",
  OUTRO = "OUTRO",
}

export interface Pasture {
  id: string;
  name: string; // Nome da pastagem (ex: "Pasto 1 - Braquiária")
  type: PastureType;
  area: number; // Área em hectares
  capacityUA: number; // Capacidade de suporte em UA/ha (Unidade Animal por hectare)
  status: PastureStatus;
  location?: string; // Localização/coordenadas
  formationDate?: string; // Data de formação (ISO)
  lastReformDate?: string; // Data da última reforma (ISO)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastureManagement {
  id: string;
  pastureId: string;
  pastureName?: string; // Cache do nome da pastagem
  type: ManagementType;
  date: string; // ISO date string
  description: string;
  cost: number; // Custo em centavos
  financialTransactionId?: string; // ID da transação financeira relacionada
  
  // Dados específicos por tipo
  fertilizerType?: string; // Tipo de fertilizante
  fertilizerAmount?: number; // Quantidade em kg
  areaTreated?: number; // Área tratada em hectares
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastureStocking {
  pastureId: string;
  pastureName: string;
  area: number; // hectares
  capacityUA: number; // UA/ha
  totalCapacity: number; // Capacidade total em UA (área * capacidadeUA)
  currentUA: number; // UA atual (calculado do rebanho)
  stockingRate: number; // Taxa de lotação (currentUA / totalCapacity)
  status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
  animals: number; // Quantidade de animais no pasto
}

export interface PastureBalance {
  totalArea: number; // Área total de pastagens em hectares
  totalCapacityUA: number; // Capacidade total em UA
  currentUA: number; // UA atual do rebanho
  stockingRate: number; // Taxa de lotação geral
  status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
  deficitUA?: number; // Déficit em UA (se superlotaado)
  surplusUA?: number; // Excesso em UA (se sublotado)
  pastures: PastureStocking[]; // Detalhamento por pasto
}

export interface PastureMetrics {
  totalArea: number; // hectares
  totalPastures: number;
  totalCapacityUA: number;
  currentUA: number;
  averageStockingRate: number; // %
  pasturesByStatus: Record<PastureStatus, number>;
  totalMaintenanceCost: number; // Custo total de manutenção em centavos
  totalFormationCost: number; // Custo total de formação em centavos
  periodStart: string;
  periodEnd: string;
}

