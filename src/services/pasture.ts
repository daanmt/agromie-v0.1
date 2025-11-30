/**
 * Serviços para o Módulo de Pastagens
 * Gerencia áreas, capacidade de suporte, lotação e manejo
 */

import { storage, STORAGE_KEYS } from "@/lib/storage";
import { financialAPI } from "./financial";
import { livestockCalculations } from "./livestock";
import {
  PastureType,
  PastureStatus,
  ManagementType,
} from "@/types/pasture";
import type {
  Pasture,
  PastureManagement,
  PastureStocking,
  PastureBalance,
  PastureMetrics,
} from "@/types/pasture";

// Constantes para cálculos
const UA_PER_ANIMAL: Record<string, number> = {
  // Baseado em peso vivo médio
  VACA: 1.0, // 450 kg = 1 UA
  NOVILHA: 0.7, // ~315 kg
  BEZERRO: 0.2, // ~90 kg
  BEZERRA: 0.2, // ~90 kg
  BOI_MAGRO: 0.8, // ~360 kg
  BOI_GORDO: 1.1, // ~495 kg
  TOURO: 1.2, // ~540 kg
  TOURUNO: 0.9, // ~405 kg
};

// ==================== PASTAGENS ====================

export const pastureService = {
  // Buscar todas as pastagens
  getAll: (): Pasture[] => {
    const pastures = storage.get<Pasture[]>(STORAGE_KEYS.PASTURES, []);
    return pastures;
  },

  // Buscar pastagem por ID
  getById: (id: string): Pasture | null => {
    const pastures = pastureService.getAll();
    return pastures.find((p) => p.id === id) || null;
  },

  // Buscar pastagens por status
  getByStatus: (status: PastureStatus): Pasture[] => {
    return pastureService.getAll().filter((p) => p.status === status);
  },

  // Buscar pastagem por nome (busca parcial, case-insensitive)
  getByName: (name: string): Pasture | null => {
    const allPastures = pastureService.getAll();
    const searchName = name.toLowerCase().trim();
    
    // Primeiro, tentar match exato
    let found = allPastures.find(
      (p) => p.name.toLowerCase().trim() === searchName
    );
    
    // Se não encontrou, tentar match parcial
    if (!found) {
      found = allPastures.find(
        (p) => p.name.toLowerCase().includes(searchName) || searchName.includes(p.name.toLowerCase())
      );
    }
    
    // Se ainda não encontrou, tentar match por número (ex: "pasto 1" encontra "Pasto 1")
    if (!found) {
      const numberMatch = searchName.match(/\d+/);
      if (numberMatch) {
        const number = numberMatch[0];
        found = allPastures.find(
          (p) => p.name.toLowerCase().includes(number) || p.name.toLowerCase().includes(`pasto ${number}`)
        );
      }
    }
    
    // Se ainda não encontrou, tentar match por palavras-chave comuns
    if (!found) {
      const keywords = ["sede", "coqueiro", "norte", "sul", "leste", "oeste"];
      const matchedKeyword = keywords.find(k => searchName.includes(k));
      if (matchedKeyword) {
        found = allPastures.find(
          (p) => p.name.toLowerCase().includes(matchedKeyword)
        );
      }
    }
    
    if (found) {
      // Log removido - muito verboso
    } else {
      console.warn(`⚠️ [PASTURE] Pasto não encontrado por nome "${name}". Pastos disponíveis:`, allPastures.map(p => p.name));
    }
    
    return found || null;
  },

  // Criar pastagem
  create: (pasture: Omit<Pasture, "id" | "createdAt" | "updatedAt">): Pasture => {
    // Validação básica
    if (!pasture.name || pasture.name.trim() === "") {
      throw new Error("Nome da pastagem é obrigatório");
    }
    if (!pasture.area || pasture.area <= 0) {
      throw new Error("Área deve ser maior que zero");
    }
    if (!pasture.capacityUA || pasture.capacityUA <= 0) {
      throw new Error("Capacidade de suporte (UA/ha) deve ser maior que zero");
    }
    
    const pastures = pastureService.getAll();
    const newPasture: Pasture = {
      ...pasture,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pastures.push(newPasture);
    storage.set(STORAGE_KEYS.PASTURES, pastures);
    // Log removido - muito verboso
    return newPasture;
  },

  // Atualizar pastagem
  update: (id: string, updates: Partial<Pasture>): Pasture | null => {
    const pastures = pastureService.getAll();
    const index = pastures.findIndex((p) => p.id === id);
    if (index === -1) return null;

    pastures[index] = {
      ...pastures[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.PASTURES, pastures);
    return pastures[index];
  },

  // Deletar pastagem
  delete: (id: string): boolean => {
    const pastures = pastureService.getAll();
    const filtered = pastures.filter((p) => p.id !== id);
    if (filtered.length === pastures.length) return false;
    storage.set(STORAGE_KEYS.PASTURES, filtered);
    return true;
  },
};

// ==================== MANEJO DE PASTAGENS ====================

export const managementService = {
  // Buscar todos os manejos
  getAll: (): PastureManagement[] => {
    return storage.get<PastureManagement[]>(STORAGE_KEYS.PASTURE_MANAGEMENTS, []);
  },

  // Buscar manejos por pastagem
  getByPasture: (pastureId: string): PastureManagement[] => {
    return managementService.getAll().filter((m) => m.pastureId === pastureId);
  },

  // Buscar manejos por tipo
  getByType: (type: ManagementType): PastureManagement[] => {
    return managementService.getAll().filter((m) => m.type === type);
  },

  // Buscar manejos por período
  getByPeriod: (startDate: string, endDate: string): PastureManagement[] => {
    const managements = managementService.getAll();
    return managements.filter((m) => m.date >= startDate && m.date <= endDate);
  },

  // Criar manejo
  create: (
    management: Omit<PastureManagement, "id" | "createdAt" | "updatedAt" | "pastureName">
  ): PastureManagement => {
    const pasture = pastureService.getById(management.pastureId);
    const managements = managementService.getAll();
    const newManagement: PastureManagement = {
      ...management,
      pastureName: pasture?.name,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    managements.push(newManagement);
    storage.set(STORAGE_KEYS.PASTURE_MANAGEMENTS, managements);
    return newManagement;
  },

  // Atualizar manejo
  update: (id: string, updates: Partial<PastureManagement>): PastureManagement | null => {
    const managements = managementService.getAll();
    const index = managements.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const pasture = updates.pastureId
      ? pastureService.getById(updates.pastureId)
      : pastureService.getById(managements[index].pastureId);

    managements[index] = {
      ...managements[index],
      ...updates,
      pastureName: pasture?.name || managements[index].pastureName,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.PASTURE_MANAGEMENTS, managements);
    return managements[index];
  },

  // Deletar manejo
  delete: (id: string): boolean => {
    const managements = managementService.getAll();
    const filtered = managements.filter((m) => m.id !== id);
    if (filtered.length === managements.length) return false;
    storage.set(STORAGE_KEYS.PASTURE_MANAGEMENTS, filtered);
    return true;
  },
};

// ==================== CÁLCULOS DE PASTAGENS ====================

/**
 * Calcular UA (Unidade Animal) total do rebanho
 * Baseado nas categorias e quantidades
 */
function calculateTotalUA(): number {
  try {
    const stock = livestockCalculations.calculateStockByCategory();
    
    let totalUA = 0;

    stock.forEach((categoryStock) => {
      const categoryCode = categoryStock.category;
      const uaPerAnimal = UA_PER_ANIMAL[categoryCode] || 1.0;
      const categoryUA = categoryStock.quantity * uaPerAnimal;
      totalUA += categoryUA;
    });

    return totalUA;
  } catch (error) {
    console.error("❌ Erro ao calcular UA total:", error);
    return 0;
  }
}

export const pastureCalculations = {
  // Calcular taxa de lotação de uma pastagem
  calculateStockingRate: (pasture: Pasture, currentUA: number): PastureStocking => {
    const totalCapacity = pasture.area * pasture.capacityUA;
    const stockingRate = totalCapacity > 0 ? (currentUA / totalCapacity) * 100 : 0;

    let status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO" = "IDEAL";
    // Limites ajustados: 70-130% para dar mais margem realista
    // Abaixo de 70% = SUBLOTADO, acima de 130% = SUPERLOTADO
    if (stockingRate < 70) {
      status = "SUBLOTADO";
    } else if (stockingRate > 130) {
      status = "SUPERLOTADO";
    }

    // Estimar quantidade de animais (aproximado)
    const animals = Math.round(currentUA / 0.8); // Média de 0.8 UA por animal

    return {
      pastureId: pasture.id,
      pastureName: pasture.name,
      area: pasture.area,
      capacityUA: pasture.capacityUA,
      totalCapacity,
      currentUA,
      stockingRate,
      status,
      animals,
    };
  },

  // Calcular balanço geral de pastagens
  calculateBalance: (): PastureBalance => {
    // Log reduzido
    const allPastures = pastureService.getAll();
    const pastures = allPastures.filter((p) => p.status === PastureStatus.PRODUZINDO);
    
    let totalUA = 0;
    
    try {
      totalUA = calculateTotalUA();
    } catch (error) {
      console.error("❌ Erro ao calcular UA total:", error);
      totalUA = 0;
    }

    let totalArea = 0;
    let totalCapacityUA = 0;
    const pastureStockings: PastureStocking[] = [];

    // PRIMEIRO: Calcular totais de área e capacidade
    pastures.forEach((pasture) => {
      totalArea += pasture.area;
      const pastureCapacity = pasture.area * pasture.capacityUA;
      totalCapacityUA += pastureCapacity;
    });

    // SEGUNDO: Distribuir UA entre pastagens (proporcional à capacidade)
    pastures.forEach((pasture) => {
      const pastureCapacity = pasture.area * pasture.capacityUA;
      
      // Distribuir UA proporcionalmente (simplificado)
      // Em um sistema real, isso seria mais complexo com localização dos animais
      const proportion = totalCapacityUA > 0 ? pastureCapacity / totalCapacityUA : 0;
      const pastureUA = totalUA * proportion;

      const stocking = pastureCalculations.calculateStockingRate(pasture, pastureUA);
      pastureStockings.push(stocking);
    });

    // Calcular taxa de lotação em porcentagem (para status)
    const stockingRatePercent = totalCapacityUA > 0 ? (totalUA / totalCapacityUA) * 100 : 0;
    
    // Calcular taxa de lotação em UA/ha (para exibição)
    const stockingRateUAperHa = totalArea > 0 ? totalUA / totalArea : 0;

    let status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO" = "IDEAL";
    let deficitUA: number | undefined;
    let surplusUA: number | undefined;

    // Limites ajustados: 70-130% para dar mais margem realista
    // Abaixo de 70% = SUBLOTADO, acima de 130% = SUPERLOTADO
    if (stockingRatePercent < 70) {
      status = "SUBLOTADO";
      surplusUA = totalCapacityUA - totalUA;
    } else if (stockingRatePercent > 130) {
      status = "SUPERLOTADO";
      deficitUA = totalUA - totalCapacityUA;
    }

    const result = {
      totalArea,
      totalCapacityUA,
      currentUA: totalUA,
      stockingRate: stockingRateUAperHa, // Retornar UA/ha para exibição
      status,
      deficitUA,
      surplusUA,
      pastures: pastureStockings,
    };
    
    // Log apenas em modo debug
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_PASTURE === "true") {
      console.log(`✅ [PASTURE] Balanço calculado:`, {
        totalArea: `${result.totalArea} ha`,
        totalCapacityUA: `${result.totalCapacityUA.toFixed(2)} UA`,
        currentUA: `${result.currentUA.toFixed(2)} UA`,
        stockingRate: `${result.stockingRate.toFixed(2)} UA/ha`,
      status: result.status,
      stockingRatePercent: `${stockingRatePercent.toFixed(2)}%`
    });
    
    return result;
  },

  // Calcular métricas de pastagens
  calculateMetrics: (startDate: string, endDate: string): PastureMetrics => {
    const pastures = pastureService.getAll();
    const managements = managementService.getByPeriod(startDate, endDate);
    const balance = pastureCalculations.calculateBalance();

    const pasturesByStatus: Record<PastureStatus, number> = {
      [PastureStatus.EM_FORMACAO]: 0,
      [PastureStatus.PRODUZINDO]: 0,
      [PastureStatus.EM_DESCANSO]: 0,
      [PastureStatus.DEGRADADA]: 0,
      [PastureStatus.EM_REFORMA]: 0,
    };

    pastures.forEach((p) => {
      pasturesByStatus[p.status] = (pasturesByStatus[p.status] || 0) + 1;
    });

    const maintenanceManagements = managements.filter(
      (m) => m.type === ManagementType.ADUBACAO ||
             m.type === ManagementType.ROÇADA ||
             m.type === ManagementType.IRRIGACAO ||
             m.type === ManagementType.CONTROLE_PRAGAS
    );

    const formationManagements = managements.filter(
      (m) => m.type === ManagementType.FORMACAO || m.type === ManagementType.REFORMA
    );

    const totalMaintenanceCost = maintenanceManagements.reduce((sum, m) => sum + m.cost, 0);
    const totalFormationCost = formationManagements.reduce((sum, m) => sum + m.cost, 0);

    return {
      totalArea: balance.totalArea,
      totalPastures: pastures.length,
      totalCapacityUA: balance.totalCapacityUA,
      currentUA: balance.currentUA,
      averageStockingRate: balance.stockingRate,
      pasturesByStatus,
      totalMaintenanceCost,
      totalFormationCost,
      periodStart: startDate,
      periodEnd: endDate,
    };
  },

  // Calcular oferta vs demanda de forragem
  calculateForageBalance: (): {
    totalOffer: number; // Oferta total em kg MS/ha/ano
    totalDemand: number; // Demanda total em kg MS/ha/ano
    balance: number; // Saldo (oferta - demanda)
    status: "SUFICIENTE" | "DEFICITARIO" | "EXCEDENTE";
  } => {
    const balance = pastureCalculations.calculateBalance();
    
    // Estimativa: 1 UA consome ~10 kg MS/dia = ~3.650 kg MS/ano
    const consumptionPerUA = 3650; // kg MS/ano por UA
    const totalDemand = balance.currentUA * consumptionPerUA;

    // Estimativa: Pastagem produz ~8.000-12.000 kg MS/ha/ano (média 10.000)
    const averageProduction = 10000; // kg MS/ha/ano
    const totalOffer = balance.totalArea * averageProduction;

    const forageBalance = totalOffer - totalDemand;

    let status: "SUFICIENTE" | "DEFICITARIO" | "EXCEDENTE" = "SUFICIENTE";
    if (forageBalance < 0) {
      status = "DEFICITARIO";
    } else if (forageBalance > totalDemand * 0.2) {
      // Mais de 20% de excedente
      status = "EXCEDENTE";
    }

    return {
      totalOffer,
      totalDemand,
      balance: forageBalance,
      status,
    };
  },
};

// ==================== INTEGRAÇÃO COM FINANCEIRO ====================

/**
 * API para registrar manejos de pastagens que afetam o financeiro
 */
export const pastureFinancialIntegration = {
  // Registrar formação de pastagem (investimento)
  registerFormation: (
    pastureId: string,
    cost: number, // em reais
    date: string,
    description: string,
    pastureType?: string
  ): { management: PastureManagement; financialTransactionId: string } => {
    // Registrar no financeiro como investimento
    // registerInvestment espera valor em REAIS, não centavos
    const financialTransaction = financialAPI.registerInvestment(
      cost, // já está em reais
      description,
      date,
      `Formação de Pastagem${pastureType ? ` - ${pastureType}` : ""}`
    );

    // Criar manejo
    const management = managementService.create({
      pastureId,
      type: ManagementType.FORMACAO,
      date,
      description,
      cost: Math.round(cost * 100),
      financialTransactionId: financialTransaction.id,
    });

    return { management, financialTransactionId: financialTransaction.id };
  },

  // Registrar reforma de pastagem (investimento)
  registerReform: (
    pastureId: string,
    cost: number, // em reais
    date: string,
    description: string
  ): { management: PastureManagement; financialTransactionId: string } => {
    // registerInvestment espera valor em REAIS, não centavos
    const financialTransaction = financialAPI.registerInvestment(
      cost, // já está em reais
      description,
      date,
      "Reforma de Pastagem"
    );

    const management = managementService.create({
      pastureId,
      type: ManagementType.REFORMA,
      date,
      description,
      cost: Math.round(cost * 100),
      financialTransactionId: financialTransaction.id,
    });

    // Atualizar data da última reforma
    pastureService.update(pastureId, { lastReformDate: date });

    return { management, financialTransactionId: financialTransaction.id };
  },

  // Registrar manutenção (despesa)
  registerMaintenance: (
    pastureId: string,
    type: ManagementType,
    cost: number, // em reais
    date: string,
    description: string,
    details?: {
      fertilizerType?: string;
      fertilizerAmount?: number;
      areaTreated?: number;
    }
  ): { management: PastureManagement; financialTransactionId: string } => {
    const pasture = pastureService.getById(pastureId);
    const pastureName = pasture?.name || "Pastagem";

    // Registrar no financeiro como despesa
    // registerExpense espera valor em REAIS, não centavos
    const financialTransaction = financialAPI.registerExpense(
      cost, // já está em reais
      description,
      date,
      `Manutenção - ${pastureName}`
    );

    // Criar manejo
    const management = managementService.create({
      pastureId,
      type,
      date,
      description,
      cost: Math.round(cost * 100),
      financialTransactionId: financialTransaction.id,
      fertilizerType: details?.fertilizerType,
      fertilizerAmount: details?.fertilizerAmount,
      areaTreated: details?.areaTreated,
    });

    return { management, financialTransactionId: financialTransaction.id };
  },
};

// ==================== INTEGRAÇÃO COM REBANHO ====================

/**
 * API para atualizar lotação baseada no rebanho
 */
export const pastureLivestockIntegration = {
  // Atualizar lotação de todas as pastagens baseado no rebanho atual
  updateStocking: (): PastureBalance => {
    return pastureCalculations.calculateBalance();
  },

  // Verificar se há superlotação
  checkOverstocking: (): {
    isOverstocked: boolean;
    deficitUA?: number;
    recommendations: string[];
  } => {
    const balance = pastureCalculations.calculateBalance();
    const recommendations: string[] = [];

    if (balance.status === "SUPERLOTADO" && balance.deficitUA) {
      recommendations.push(
        `Superlotação detectada: déficit de ${balance.deficitUA.toFixed(2)} UA`
      );
      recommendations.push("Recomendações:");
      recommendations.push("- Reduzir número de animais");
      recommendations.push("- Aumentar área de pastagens");
      recommendations.push("- Melhorar capacidade de suporte (adubação, irrigação)");
    } else if (balance.status === "SUBLOTADO" && balance.surplusUA) {
      recommendations.push(
        `Sublotação detectada: capacidade excedente de ${balance.surplusUA.toFixed(2)} UA`
      );
      recommendations.push("Recomendações:");
      recommendations.push("- Aumentar número de animais");
      recommendations.push("- Reduzir área de pastagens (se possível)");
    } else {
      recommendations.push("Lotação dentro do ideal");
    }

    return {
      isOverstocked: balance.status === "SUPERLOTADO",
      deficitUA: balance.deficitUA,
      recommendations,
    };
  },
};

