/**
 * Sistema simples de armazenamento local
 * Usa localStorage para persistência temporária
 * Será substituído por backend quando necessário
 */

const STORAGE_PREFIX = "agromie_";

export const storage = {
  // Salvar dados
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
      // Log reduzido - apenas em modo debug
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_STORAGE === "true") {
        console.log(`💾 [STORAGE] Dados salvos em ${key}:`, {
          count: Array.isArray(value) ? value.length : 1,
        });
      }
    } catch (error) {
      console.error(`❌ [STORAGE] Erro ao salvar ${key}:`, error);
    }
  },

  // Recuperar dados
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) {
        // Log apenas se não for padrão esperado
        if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_STORAGE === "true") {
          console.log(`📂 [STORAGE] ${key} não encontrado, usando padrão`);
        }
        return defaultValue;
      }
      const parsed = JSON.parse(item) as T;
      // Log reduzido - apenas em modo debug
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_STORAGE === "true") {
        console.log(`📂 [STORAGE] Dados recuperados de ${key}:`, {
          count: Array.isArray(parsed) ? parsed.length : 1
        });
      }
      return parsed;
    } catch (error) {
      console.error(`❌ [STORAGE] Erro ao recuperar ${key}:`, error);
      return defaultValue;
    }
  },

  // Remover dados
  remove: (key: string): void => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
    }
  },

  // Limpar todos os dados do app
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
    }
  },
};

// Chaves de armazenamento
export const STORAGE_KEYS = {
  FINANCIAL_ACCOUNTS: "financial_accounts",
  FINANCIAL_TRANSACTIONS: "financial_transactions",
  LIVESTOCK_CATEGORIES: "livestock_categories",
  LIVESTOCK_EVENTS: "livestock_events",
  LIVESTOCK_ANIMALS: "livestock_animals",
  LIVESTOCK_MOVEMENTS: "livestock_movements",
  PASTURES: "pastures",
  PASTURE_MANAGEMENTS: "pasture_managements",
} as const;

