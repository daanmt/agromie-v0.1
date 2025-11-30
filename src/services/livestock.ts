/**
 * Serviços para o Módulo do Rebanho
 * Gerencia categorias, animais, eventos e cálculos zootécnicos
 */

import { storage, STORAGE_KEYS } from "@/lib/storage";
import { financialAPI } from "./financial";
import { LivestockCategory, LivestockEventType } from "@/types/livestock";
import type {
  LivestockCategoryConfig,
  LivestockAnimal,
  LivestockEvent,
  LivestockStock,
  LivestockMetrics,
  WeightEvolution,
  LivestockMovement,
} from "@/types/livestock";

// ==================== CATEGORIAS ZOOTÉCNICAS ====================

export const categoryService = {
  // Buscar todas as categorias
  getAll: (): LivestockCategoryConfig[] => {
    return storage.get<LivestockCategoryConfig[]>(STORAGE_KEYS.LIVESTOCK_CATEGORIES, []);
  },

  // Buscar categoria por ID
  getById: (id: string): LivestockCategoryConfig | null => {
    const categories = categoryService.getAll();
    return categories.find((c) => c.id === id) || null;
  },

  // Buscar categoria por código
  getByCode: (code: string): LivestockCategoryConfig | null => {
    const categories = categoryService.getAll();
    return categories.find((c) => c.code === code && c.active) || null;
  },

  // Buscar categoria por enum
  getByCategory: (category: LivestockCategory): LivestockCategoryConfig | null => {
    const categories = categoryService.getAll();
    return categories.find((c) => c.category === category && c.active) || null;
  },

  // Criar categoria
  create: (
    category: Omit<LivestockCategoryConfig, "id" | "createdAt" | "updatedAt">
  ): LivestockCategoryConfig => {
    const categories = categoryService.getAll();
    const newCategory: LivestockCategoryConfig = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    storage.set(STORAGE_KEYS.LIVESTOCK_CATEGORIES, categories);
    return newCategory;
  },

  // Atualizar categoria
  update: (
    id: string,
    updates: Partial<LivestockCategoryConfig>
  ): LivestockCategoryConfig | null => {
    const categories = categoryService.getAll();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.LIVESTOCK_CATEGORIES, categories);
    return categories[index];
  },

  // Deletar categoria (soft delete)
  delete: (id: string): boolean => {
    return categoryService.update(id, { active: false }) !== null;
  },

  // Inicializar categorias padrão
  initializeDefault: (): void => {
    const existing = categoryService.getAll();
    if (existing.length > 0) return;

    const defaultCategories: Omit<LivestockCategoryConfig, "id" | "createdAt" | "updatedAt">[] = [
      {
        code: "VACA",
        name: "Vaca",
        category: LivestockCategory.VACA,
        gender: "F",
        minAgeMonths: 24,
        active: true,
      },
      {
        code: "NOVILHA",
        name: "Novilha",
        category: LivestockCategory.NOVILHA,
        gender: "F",
        minAgeMonths: 12,
        maxAgeMonths: 24,
        active: true,
      },
      {
        code: "BEZERRO",
        name: "Bezerro",
        category: LivestockCategory.BEZERRO,
        gender: "M",
        maxAgeMonths: 12,
        active: true,
      },
      {
        code: "BEZERRA",
        name: "Bezerra",
        category: LivestockCategory.BEZERRA,
        gender: "F",
        maxAgeMonths: 12,
        active: true,
      },
      {
        code: "BOI_MAGRO",
        name: "Boi Magro",
        category: LivestockCategory.BOI_MAGRO,
        gender: "M",
        minAgeMonths: 12,
        minWeightKg: 300,
        maxWeightKg: 450,
        active: true,
      },
      {
        code: "BOI_GORDO",
        name: "Boi Gordo",
        category: LivestockCategory.BOI_GORDO,
        gender: "M",
        minAgeMonths: 24,
        minWeightKg: 450,
        active: true,
      },
      {
        code: "TOURO",
        name: "Touro",
        category: LivestockCategory.TOURO,
        gender: "M",
        minAgeMonths: 24,
        active: true,
      },
      {
        code: "TOURUNO",
        name: "Touruno",
        category: LivestockCategory.TOURUNO,
        gender: "M",
        minAgeMonths: 12,
        maxAgeMonths: 24,
        active: true,
      },
    ];

    defaultCategories.forEach((category) => {
      categoryService.create(category);
    });
  },
};

// ==================== ANIMAIS ====================

export const animalService = {
  // Buscar todos os animais
  getAll: (): LivestockAnimal[] => {
    return storage.get<LivestockAnimal[]>(STORAGE_KEYS.LIVESTOCK_ANIMALS, []);
  },

  // Buscar animais ativos
  getActive: (): LivestockAnimal[] => {
    return animalService.getAll().filter((a) => a.status === "ATIVO");
  },

  // Buscar animal por ID
  getById: (id: string): LivestockAnimal | null => {
    const animals = animalService.getAll();
    return animals.find((a) => a.id === id) || null;
  },

  // Buscar animal por número do brinco
  getByTag: (tagNumber: string): LivestockAnimal | null => {
    const animals = animalService.getAll();
    return animals.find((a) => a.tagNumber === tagNumber) || null;
  },

  // Buscar animais por categoria
  getByCategory: (categoryId: string): LivestockAnimal[] => {
    return animalService.getActive().filter((a) => a.categoryId === categoryId);
  },

  // Criar animal
  create: (animal: Omit<LivestockAnimal, "id" | "createdAt" | "updatedAt" | "categoryName">): LivestockAnimal => {
    // Log removido - muito verboso (cria muitos animais)
    const category = categoryService.getById(animal.categoryId);
    const animals = animalService.getAll();
    const newAnimal: LivestockAnimal = {
      ...animal,
      categoryName: category?.name,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    animals.push(newAnimal);
    storage.set(STORAGE_KEYS.LIVESTOCK_ANIMALS, animals);
    // Log removido - muito verboso (cria muitos animais)
    return newAnimal;
  },

  // Atualizar animal
  update: (id: string, updates: Partial<LivestockAnimal>): LivestockAnimal | null => {
    const animals = animalService.getAll();
    const index = animals.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const category = updates.categoryId
      ? categoryService.getById(updates.categoryId)
      : categoryService.getById(animals[index].categoryId);

    animals[index] = {
      ...animals[index],
      ...updates,
      categoryName: category?.name || animals[index].categoryName,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.LIVESTOCK_ANIMALS, animals);
    return animals[index];
  },

  // Deletar animal (soft delete)
  delete: (id: string): boolean => {
    return animalService.update(id, { status: "MORTO" }) !== null;
  },
};

// ==================== EVENTOS ====================

export const eventService = {
  // Buscar todos os eventos
  getAll: (): LivestockEvent[] => {
    return storage.get<LivestockEvent[]>(STORAGE_KEYS.LIVESTOCK_EVENTS, []);
  },

  // Buscar evento por ID
  getById: (id: string): LivestockEvent | null => {
    const events = eventService.getAll();
    return events.find((e) => e.id === id) || null;
  },

  // Buscar eventos por tipo
  getByType: (type: LivestockEventType): LivestockEvent[] => {
    const events = eventService.getAll();
    return events.filter((e) => e.type === type);
  },

  // Buscar eventos por animal
  getByAnimal: (animalId: string): LivestockEvent[] => {
    const events = eventService.getAll();
    return events.filter((e) => e.animalId === animalId);
  },

  // Buscar eventos por período
  getByPeriod: (startDate: string, endDate: string): LivestockEvent[] => {
    const events = eventService.getAll();
    return events.filter((e) => e.date >= startDate && e.date <= endDate);
  },

  // Criar evento
  create: (
    event: Omit<LivestockEvent, "id" | "createdAt" | "updatedAt" | "categoryName">
  ): LivestockEvent => {
    // Log removido - muito verboso
    const category = categoryService.getById(event.categoryId);
    const events = eventService.getAll();
    const newEvent: LivestockEvent = {
      ...event,
      categoryName: category?.name,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.push(newEvent);
    storage.set(STORAGE_KEYS.LIVESTOCK_EVENTS, events);
    // Log removido - muito verboso
    return newEvent;
  },

  // Atualizar evento
  update: (id: string, updates: Partial<LivestockEvent>): LivestockEvent | null => {
    const events = eventService.getAll();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const category = updates.categoryId
      ? categoryService.getById(updates.categoryId)
      : categoryService.getById(events[index].categoryId);

    events[index] = {
      ...events[index],
      ...updates,
      categoryName: category?.name || events[index].categoryName,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.LIVESTOCK_EVENTS, events);
    return events[index];
  },

  // Deletar evento
  delete: (id: string): boolean => {
    const events = eventService.getAll();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;
    storage.set(STORAGE_KEYS.LIVESTOCK_EVENTS, filtered);
    return true;
  },
};

// ==================== CÁLCULOS ZOOTÉCNICOS ====================

export const livestockCalculations = {
  // Calcular estoque zootécnico por categoria
  calculateStockByCategory: (): LivestockStock[] => {
    console.log(`🐄 [LIVESTOCK] Calculando estoque por categoria...`);
    const categories = categoryService.getAll().filter((c) => c.active);
    const animals = animalService.getActive();
    console.log(`📊 Total de animais ativos: ${animals.length}`);
    console.log(`📊 Animais com purchasePrice:`, animals.filter(a => a.purchasePrice && a.purchasePrice > 0).length);
    const stock: LivestockStock[] = [];

    categories.forEach((category) => {
      const categoryAnimals = animals.filter((a) => a.categoryId === category.id);
      const quantity = categoryAnimals.length;
      const totalWeight = categoryAnimals.reduce((sum, a) => sum + (a.currentWeight || 0), 0);
      const averageWeight = quantity > 0 ? totalWeight / quantity : 0;

      // Calcular valor patrimonial
      // Prioridade: 1) Preço de compra, 2) Peso × cotação, 3) Valor padrão por categoria
      let totalValue = 0;
      let animalsWithPurchasePrice = 0;
      let animalsWithWeight = 0;
      let animalsWithDefault = 0;
      
      categoryAnimals.forEach((animal) => {
        if (animal.purchasePrice && animal.purchasePrice > 0) {
          // Usar preço de compra quando disponível
          totalValue += animal.purchasePrice;
          animalsWithPurchasePrice++;
          // Log removido - muito verboso para cada animal
        } else if (animal.currentWeight && animal.currentWeight > 0) {
          // Se tem peso, calcular pelo peso × cotação
          const estimatedPricePerKg = 8.50; // R$ 8,50/kg (exemplo)
          const animalValue = Math.round((animal.currentWeight / 1000) * estimatedPricePerKg * 100);
          totalValue += animalValue;
          animalsWithWeight++;
        } else {
          // Valor padrão por categoria (estimativa conservadora)
          const defaultValues: Record<string, number> = {
            VACA: 350000, // R$ 3.500,00
            NOVILHA: 250000, // R$ 2.500,00
            BEZERRO: 80000, // R$ 800,00
            BEZERRA: 80000, // R$ 800,00
            BOI_MAGRO: 300000, // R$ 3.000,00
            BOI_GORDO: 450000, // R$ 4.500,00
            TOURO: 500000, // R$ 5.000,00
            TOURUNO: 400000, // R$ 4.000,00
          };
          const categoryCode = category.category;
          const defaultValue = defaultValues[categoryCode] || 150000; // R$ 1.500,00 padrão
          totalValue += defaultValue;
          animalsWithDefault++;
        }
      });
      
      // Log reduzido - apenas em modo debug
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_LIVESTOCK === "true") {
        console.log(`💰 [LIVESTOCK] ${category.name}: ${quantity} animais, Valor total: R$ ${(totalValue / 100).toFixed(2)}`);
        console.log(`   - Com preço de compra: ${animalsWithPurchasePrice}`);
        console.log(`   - Com peso: ${animalsWithWeight}`);
        console.log(`   - Valor padrão: ${animalsWithDefault}`);
      }
      
      const averageValue = quantity > 0 ? Math.round(totalValue / quantity) : 0;

      stock.push({
        categoryId: category.id,
        categoryName: category.name,
        category: category.category,
        quantity,
        totalWeight,
        averageWeight,
        totalValue,
        averageValue,
      });
    });

    return stock;
  },

  // Calcular métricas gerais
  calculateMetrics: (startDate: string, endDate: string): LivestockMetrics => {
    const animals = animalService.getActive();
    const events = eventService.getByPeriod(startDate, endDate);

    // Totais gerais
    const totalAnimals = animals.length;
    const totalWeight = animals.reduce((sum, a) => sum + (a.currentWeight || 0), 0);
    const averageWeight = totalAnimals > 0 ? totalWeight / totalAnimals : 0;

    // Calcular valor patrimonial total
    const stockByCategory = livestockCalculations.calculateStockByCategory();
    const totalValue = stockByCategory.reduce((sum, s) => sum + s.totalValue, 0);

    // Calcular taxas
    const births = events.filter((e) => e.type === LivestockEventType.NASCIMENTO);
    const deaths = events.filter((e) => e.type === LivestockEventType.MORTE);
    const sales = events.filter((e) => e.type === LivestockEventType.VENDA);

    const initialStock = animals.length + sales.reduce((sum, e) => sum + (e.quantity || 1), 0) - births.reduce((sum, e) => sum + (e.quantity || 1), 0);
    const averageStock = initialStock > 0 ? (initialStock + totalAnimals) / 2 : totalAnimals;

    const birthRate = averageStock > 0 ? (births.reduce((sum, e) => sum + (e.quantity || 1), 0) / averageStock) * 100 : 0;
    const mortalityRate = averageStock > 0 ? (deaths.reduce((sum, e) => sum + (e.quantity || 1), 0) / averageStock) * 100 : 0;
    const turnoverRate = averageStock > 0 ? (sales.reduce((sum, e) => sum + (e.quantity || 1), 0) / averageStock) * 100 : 0;

    // Calcular GMD médio
    const weightEvents = events.filter((e) => e.type === LivestockEventType.PESAGEM && e.weight);
    const averageGMD = livestockCalculations.calculateAverageGMD(weightEvents);

    return {
      totalAnimals,
      totalWeight,
      averageWeight,
      totalValue,
      stockByCategory,
      birthRate,
      mortalityRate,
      turnoverRate,
      averageGMD,
      periodStart: startDate,
      periodEnd: endDate,
    };
  },

  // Calcular GMD (Ganho Médio Diário) para um animal
  calculateGMDForAnimal: (animalId: string): number | null => {
    const weightEvents = eventService
      .getByAnimal(animalId)
      .filter((e) => e.type === LivestockEventType.PESAGEM && e.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (weightEvents.length < 2) return null;

    const firstWeight = weightEvents[0].weight!;
    const lastWeight = weightEvents[weightEvents.length - 1].weight!;
    const firstDate = new Date(weightEvents[0].date);
    const lastDate = new Date(weightEvents[weightEvents.length - 1].date);
    const daysDiff = Math.max(1, Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));

    const weightGain = lastWeight - firstWeight;
    return weightGain / daysDiff; // gramas por dia
  },

  // Calcular GMD médio de múltiplas pesagens
  calculateAverageGMD: (weightEvents: LivestockEvent[]): number => {
    if (weightEvents.length < 2) return 0;

    // Agrupar por animal
    const byAnimal = new Map<string, LivestockEvent[]>();
    weightEvents.forEach((e) => {
      if (e.animalId) {
        const existing = byAnimal.get(e.animalId) || [];
        existing.push(e);
        byAnimal.set(e.animalId, existing);
      }
    });

    let totalGMD = 0;
    let count = 0;

    byAnimal.forEach((events) => {
      const sorted = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (sorted.length >= 2) {
        const firstWeight = sorted[0].weight!;
        const lastWeight = sorted[sorted.length - 1].weight!;
        const firstDate = new Date(sorted[0].date);
        const lastDate = new Date(sorted[sorted.length - 1].date);
        const daysDiff = Math.max(1, Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        const gmd = (lastWeight - firstWeight) / daysDiff;
        totalGMD += gmd;
        count++;
      }
    });

    return count > 0 ? totalGMD / count : 0;
  },

  // Obter evolução de peso de um animal
  getWeightEvolution: (animalId: string): WeightEvolution | null => {
    const animal = animalService.getById(animalId);
    if (!animal) return null;

    const weightEvents = eventService
      .getByAnimal(animalId)
      .filter((e) => e.type === LivestockEventType.PESAGEM && e.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const measurements = weightEvents.map((e) => {
      const eventDate = new Date(e.date);
      const birthDate = animal.birthDate ? new Date(animal.birthDate) : null;
      const ageDays = birthDate ? Math.floor((eventDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

      return {
        date: e.date,
        weight: e.weight!,
        ageDays,
      };
    });

    const gmd = livestockCalculations.calculateGMDForAnimal(animalId);

    return {
      animalId,
      animalTagNumber: animal.tagNumber,
      measurements,
      gmd: gmd || undefined,
    };
  },
};

// ==================== INTEGRAÇÃO COM FINANCEIRO ====================

/**
 * API para registrar eventos do rebanho que afetam o financeiro
 */
export const livestockFinancialIntegration = {
  // Registrar compra de animais
  registerPurchase: (
    categoryId: string,
    quantity: number,
    pricePerHead: number, // em reais
    date: string,
    description: string
  ): { event: LivestockEvent; financialTransactionId: string } => {
    try {
      // Garantir que categorias estão inicializadas
      categoryService.initializeDefault();
      
      const category = categoryService.getById(categoryId);
      if (!category) {
        throw new Error(`Categoria com ID ${categoryId} não encontrada`);
      }

      const totalPrice = quantity * pricePerHead;
      if (totalPrice <= 0) {
        throw new Error("Valor total deve ser maior que zero");
      }

      // Registrar no financeiro como INVESTIMENTO (não despesa!)
      // registerInvestment espera valor em REAIS, não centavos
      console.log(`💰 [PURCHASE] Criando investimento financeiro: R$ ${totalPrice} (${totalPrice} reais)`);
      const financialTransaction = financialAPI.registerInvestment(
        totalPrice, // já está em reais
        description,
        date,
        `Compra de ${category.name}`
      );
      console.log(`✅ [PURCHASE] Investimento financeiro criado com sucesso! ID: ${financialTransaction.id}, Valor: R$ ${totalPrice}`);

      // Criar os animais individuais
      console.log(`🟢 Criando ${quantity} animais comprados da categoria ${category.name}...`);
      for (let i = 0; i < quantity; i++) {
        const newAnimal = animalService.create({
          categoryId,
          purchaseDate: date,
          purchasePrice: Math.round(pricePerHead * 100), // em centavos
          status: "ATIVO",
          gender: category.gender || "M",
          currentWeight: 0, // Peso inicial será atualizado na primeira pesagem
        });
        console.log(`✅ Animal criado: ${newAnimal.id} (${category.name})`);
      }
      
      // Verificar se foram salvos
      const savedAnimals = animalService.getByCategory(categoryId);
      console.log(`📊 Total de animais salvos na categoria ${category.name}: ${savedAnimals.length}`);

      // Criar evento
      const event = eventService.create({
        type: LivestockEventType.COMPRA,
        categoryId,
        date,
        description,
        quantity,
        price: Math.round(totalPrice * 100),
        financialTransactionId: financialTransaction.id,
      });

      return { event, financialTransactionId: financialTransaction.id };
    } catch (error) {
      console.error("Erro ao registrar compra:", error);
      throw error;
    }
  },

  // Registrar venda de animais
  registerSale: (
    categoryId: string,
    quantity: number,
    pricePerHead: number, // em reais
    date: string,
    description: string,
    animalIds?: string[] // IDs dos animais vendidos
  ): { event: LivestockEvent; financialTransactionId: string } => {
    const category = categoryService.getById(categoryId);
    const totalPrice = quantity * pricePerHead;

    console.log(`💰 [SALE] Registrando venda: ${quantity} animais, categoria ${category?.name}, R$ ${totalPrice}`);

    // Registrar no financeiro
    // registerRevenue espera valor em REAIS, não centavos
    console.log(`💰 [SALE] Criando receita financeira: R$ ${totalPrice} (${totalPrice} reais)`);
    const financialTransaction = financialAPI.registerRevenue(
      totalPrice, // já está em reais
      description,
      date,
      `Venda de ${category?.name || "Animais"}`
    );
    console.log(`✅ [SALE] Receita financeira criada com sucesso! ID: ${financialTransaction.id}, Valor: R$ ${totalPrice}`);

    // Criar evento
    const event = eventService.create({
      type: LivestockEventType.VENDA,
      categoryId,
      date,
      description,
      quantity,
      price: Math.round(totalPrice * 100),
      financialTransactionId: financialTransaction.id,
    });
    console.log(`📋 [SALE] Evento de venda criado: ${event.id}`);

    // Selecionar animais para vender se não foram especificados
    let animalsToSell: string[] = [];
    
    if (animalIds && animalIds.length > 0) {
      // Usar IDs fornecidos
      animalsToSell = animalIds;
      console.log(`🎯 [SALE] Usando ${animalIds.length} animais especificados`);
    } else {
      // Selecionar automaticamente animais ATIVOS da categoria
      const activeAnimals = animalService.getActive().filter(
        (a) => a.categoryId === categoryId && a.status === "ATIVO"
      );
      
      // Ordenar por data de criação (FIFO - primeiro a entrar, primeiro a sair)
      activeAnimals.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Pegar os primeiros N animais
      animalsToSell = activeAnimals.slice(0, quantity).map(a => a.id);
      console.log(`🎯 [SALE] Selecionados automaticamente ${animalsToSell.length} animais da categoria ${category?.name}`);
      
      if (animalsToSell.length < quantity) {
        console.warn(`⚠️ [SALE] Aviso: apenas ${animalsToSell.length} animais disponíveis para venda, mas ${quantity} foram solicitados`);
      }
    }

    // Atualizar status dos animais vendidos
    let animalsUpdated = 0;
    animalsToSell.forEach((id) => {
      const updated = animalService.update(id, { status: "VENDIDO" });
      if (updated) {
        animalsUpdated++;
        console.log(`✅ [SALE] Animal ${id} marcado como VENDIDO`);
      } else {
        console.warn(`⚠️ [SALE] Animal ${id} não encontrado para atualização`);
      }
    });
    
    console.log(`✅ [SALE] Venda concluída: ${animalsUpdated} animais marcados como vendidos`);

    return { event, financialTransactionId: financialTransaction.id };
  },

  // Registrar nascimento (não afeta financeiro diretamente, mas pode ser usado para cálculos)
  registerBirth: (
    categoryId: string,
    quantity: number,
    date: string,
    description: string,
    motherId?: string
  ): LivestockEvent => {
    // Garantir que categorias estão inicializadas
    categoryService.initializeDefault();
    
    const category = categoryService.getById(categoryId);
    if (!category) {
      throw new Error(`Categoria com ID ${categoryId} não encontrada`);
    }

    // Criar os animais individuais
    console.log(`🟢 Criando ${quantity} animais da categoria ${category.name}...`);
    for (let i = 0; i < quantity; i++) {
      const newAnimal = animalService.create({
        categoryId,
        birthDate: date,
        status: "ATIVO",
        gender: category.gender || "M",
        currentWeight: 0, // Peso inicial será atualizado na primeira pesagem
        motherId: motherId,
      });
      console.log(`✅ Animal criado: ${newAnimal.id} (${category.name})`);
    }
    
    // Verificar se foram salvos
    const savedAnimals = animalService.getByCategory(categoryId);
    console.log(`📊 Total de animais salvos na categoria ${category.name}: ${savedAnimals.length}`);

    // Criar o evento de nascimento
    return eventService.create({
      type: LivestockEventType.NASCIMENTO,
      categoryId,
      date,
      description,
      quantity,
    });
  },

  // Registrar morte (pode afetar valor patrimonial)
  registerDeath: (
    animalId: string,
    date: string,
    description: string,
    cause?: string
  ): LivestockEvent => {
    const animal = animalService.getById(animalId);
    if (!animal) throw new Error("Animal não encontrado");

    // Atualizar status do animal
    animalService.update(animalId, { status: "MORTO" });

    return eventService.create({
      type: LivestockEventType.MORTE,
      animalId,
      categoryId: animal.categoryId,
      date,
      description: `${description}${cause ? ` - Causa: ${cause}` : ""}`,
      quantity: 1,
    });
  },

  // Registrar pesagem
  registerWeight: (
    animalId: string,
    weight: number, // em kg
    date: string,
    notes?: string
  ): LivestockEvent => {
    const animal = animalService.getById(animalId);
    if (!animal) throw new Error("Animal não encontrado");

    // Atualizar peso do animal
    animalService.update(animalId, { currentWeight: Math.round(weight * 1000) }); // converter kg para gramas

    return eventService.create({
      type: LivestockEventType.PESAGEM,
      animalId,
      categoryId: animal.categoryId,
      date,
      description: `Pesagem: ${weight.toFixed(2)} kg`,
      weight: Math.round(weight * 1000), // em gramas
      notes,
    });
  },
};

// ==================== MOVIMENTAÇÕES INTERNAS ====================

export const movementService = {
  // Registrar movimentação interna (mudança de categoria)
  registerMovement: (
    animalId: string,
    fromCategoryId: string,
    toCategoryId: string,
    date: string,
    reason: string,
    notes?: string
  ): { movement: LivestockMovement; event: LivestockEvent } => {
    const animal = animalService.getById(animalId);
    if (!animal) throw new Error("Animal não encontrado");

    // Criar movimento
    const movement: LivestockMovement = {
      id: crypto.randomUUID(),
      animalId,
      fromCategoryId,
      toCategoryId,
      date,
      reason,
      notes,
      createdAt: new Date().toISOString(),
    };

    // Atualizar categoria do animal
    animalService.update(animalId, { categoryId: toCategoryId });

    // Criar evento
    const fromCategory = categoryService.getById(fromCategoryId);
    const toCategory = categoryService.getById(toCategoryId);
    const event = eventService.create({
      type: LivestockEventType.MOVIMENTACAO_INTERNA,
      animalId,
      categoryId: toCategoryId,
      date,
      description: `Movimentação: ${fromCategory?.name} → ${toCategory?.name} - ${reason}`,
      notes,
    });

    // Salvar movimento (se necessário persistir separadamente)
    const movements = storage.get<LivestockMovement[]>(STORAGE_KEYS.LIVESTOCK_MOVEMENTS, []);
    movements.push(movement);
    storage.set(STORAGE_KEYS.LIVESTOCK_MOVEMENTS, movements);

    return { movement, event };
  },
};

