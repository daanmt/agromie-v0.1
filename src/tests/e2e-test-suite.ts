/**
 * Suite de Testes End-to-End para AgrOmie
 * Simula operações reais do sistema e valida integrações
 */

import { financialAPI, transactionService, financialCalculations } from "@/services/financial";
import { livestockFinancialIntegration, categoryService, animalService, livestockCalculations } from "@/services/livestock";
import { pastureService, pastureFinancialIntegration, pastureCalculations } from "@/services/pasture";
import { storage, STORAGE_KEYS } from "@/lib/storage";

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

const testResults: TestResult[] = [];

function logTest(name: string, success: boolean, message: string, data?: any, errors?: string[]) {
  testResults.push({ name, success, message, data, errors });
  const icon = success ? "✅" : "❌";
  console.log(`${icon} [TEST] ${name}: ${message}`);
  if (errors && errors.length > 0) {
    console.error(`   Erros:`, errors);
  }
}

/**
 * Limpar todos os dados antes dos testes
 */
function clearAllData() {
  console.log("\n🧹 [TEST] Limpando dados anteriores...");
  storage.clear();
  categoryService.initializeDefault();
  console.log("✅ [TEST] Dados limpos");
}

/**
 * Teste 1: Registro de Pastagens
 */
function test1_RegisterPastures(): TestResult {
  try {
    console.log("\n📋 [TEST 1] Registrando pastagens...");
    
    // Pasto 1
    const pasture1 = pastureService.create({
      name: "Pasto da Sede",
      area: 40,
      capacityUA: 1.2,
      type: "NATIVO",
      status: "EM_PRODUCAO",
    });
    logTest("Registrar Pasto 1", true, `Pasto "${pasture1.name}" criado`, { id: pasture1.id, area: pasture1.area });

    // Pasto 2
    const pasture2 = pastureService.create({
      name: "Pasto do Coqueiro",
      area: 40,
      capacityUA: 1.2,
      type: "NATIVO",
      status: "EM_PRODUCAO",
    });
    logTest("Registrar Pasto 2", true, `Pasto "${pasture2.name}" criado`, { id: pasture2.id, area: pasture2.area });

    const allPastures = pastureService.getAll();
    if (allPastures.length !== 2) {
      return { name: "Teste 1", success: false, message: `Esperado 2 pastos, encontrado ${allPastures.length}` };
    }

    return { name: "Teste 1", success: true, message: "2 pastagens registradas com sucesso" };
  } catch (error) {
    return { name: "Teste 1", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 2: Compra de Animais com Integração Financeira
 */
function test2_PurchaseAnimals(): TestResult {
  try {
    console.log("\n📋 [TEST 2] Registrando compra de animais...");
    
    categoryService.initializeDefault();
    const bezerraCategory = categoryService.getByCategory("BEZERRA");
    if (!bezerraCategory) {
      return { name: "Teste 2", success: false, message: "Categoria BEZERRA não encontrada" };
    }

    const quantity = 100;
    const pricePerHead = 1500; // R$ 1.500 por cabeça
    const totalPrice = quantity * pricePerHead; // R$ 150.000
    const date = "2025-11-30";

    const result = livestockFinancialIntegration.registerPurchase(
      bezerraCategory.id,
      quantity,
      pricePerHead,
      date,
      "Compra de 100 bezerras com 6@ de média"
    );

    // Verificar se animais foram criados
    const animals = animalService.getByCategory(bezerraCategory.id);
    if (animals.length !== quantity) {
      return { name: "Teste 2", success: false, message: `Esperado ${quantity} animais, encontrado ${animals.length}` };
    }

    // Verificar se investimento financeiro foi criado
    const transactions = transactionService.getAll();
    const investment = transactions.find(t => t.id === result.financialTransactionId);
    if (!investment) {
      return { name: "Teste 2", success: false, message: "Investimento financeiro não encontrado" };
    }

    const investmentAmountReais = investment.amount / 100;
    if (Math.abs(investmentAmountReais - totalPrice) > 0.01) {
      return { name: "Teste 2", success: false, message: `Valor do investimento incorreto. Esperado R$ ${totalPrice}, encontrado R$ ${investmentAmountReais}` };
    }

    logTest("Compra de Animais", true, `${quantity} bezerras compradas por R$ ${totalPrice.toLocaleString("pt-BR")}`, {
      animalsCreated: animals.length,
      investmentId: investment.id,
      investmentAmount: investmentAmountReais,
    });

    return { name: "Teste 2", success: true, message: `Compra de ${quantity} animais registrada com investimento financeiro` };
  } catch (error) {
    return { name: "Teste 2", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 3: Cálculo de UA e Taxa de Lotação
 */
function test3_CalculateUAAndStocking(): TestResult {
  try {
    console.log("\n📋 [TEST 3] Calculando UA e taxa de lotação...");
    
    const balance = pastureCalculations.calculateBalance();
    
    // Verificar UA total
    const expectedUA = 100 * 0.2; // 100 bezerras × 0.2 UA = 20 UA
    if (Math.abs(balance.currentUA - expectedUA) > 0.01) {
      return { name: "Teste 3", success: false, message: `UA esperada: ${expectedUA}, encontrada: ${balance.currentUA}` };
    }

    // Verificar capacidade total
    const expectedCapacity = (40 + 40) * 1.2; // 80 ha × 1.2 UA/ha = 96 UA
    if (Math.abs(balance.totalCapacityUA - expectedCapacity) > 0.01) {
      return { name: "Teste 3", success: false, message: `Capacidade esperada: ${expectedCapacity} UA, encontrada: ${balance.totalCapacityUA} UA` };
    }

    // Verificar taxa de lotação
    const expectedStockingRate = (balance.currentUA / balance.totalCapacityUA) * 100;
    if (Math.abs(balance.stockingRate - expectedStockingRate) > 0.01) {
      return { name: "Teste 3", success: false, message: `Taxa de lotação incorreta` };
    }

    logTest("Cálculo UA e Lotação", true, `UA: ${balance.currentUA}, Capacidade: ${balance.totalCapacityUA} UA, Taxa: ${balance.stockingRate.toFixed(2)}%`, balance);

    return { name: "Teste 3", success: true, message: "Cálculos de UA e lotação corretos" };
  } catch (error) {
    return { name: "Teste 3", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 4: Venda de Animais com Integração Financeira
 */
function test4_SellAnimals(): TestResult {
  try {
    console.log("\n📋 [TEST 4] Registrando venda de animais...");
    
    const bezerraCategory = categoryService.getByCategory("BEZERRA");
    if (!bezerraCategory) {
      return { name: "Teste 4", success: false, message: "Categoria BEZERRA não encontrada" };
    }

    const quantity = 50;
    const pricePerHead = 2000; // R$ 2.000 por cabeça
    const totalPrice = quantity * pricePerHead; // R$ 100.000
    const date = "2025-12-15";

    const result = livestockFinancialIntegration.registerSale(
      bezerraCategory.id,
      quantity,
      pricePerHead,
      date,
      "Venda de 50 bezerras"
    );

    // Verificar se animais foram marcados como vendidos
    const activeAnimals = animalService.getActive();
    const bezerrasAtivas = activeAnimals.filter(a => a.categoryId === bezerraCategory.id);
    const expectedActive = 100 - quantity; // 50 restantes

    if (bezerrasAtivas.length !== expectedActive) {
      return { name: "Teste 4", success: false, message: `Esperado ${expectedActive} bezerras ativas, encontrado ${bezerrasAtivas.length}` };
    }

    // Verificar se receita financeira foi criada
    const transactions = transactionService.getAll();
    const revenue = transactions.find(t => t.id === result.financialTransactionId);
    if (!revenue) {
      return { name: "Teste 4", success: false, message: "Receita financeira não encontrada" };
    }

    const revenueAmountReais = revenue.amount / 100;
    if (Math.abs(revenueAmountReais - totalPrice) > 0.01) {
      return { name: "Teste 4", success: false, message: `Valor da receita incorreto. Esperado R$ ${totalPrice}, encontrado R$ ${revenueAmountReais}` };
    }

    logTest("Venda de Animais", true, `${quantity} bezerras vendidas por R$ ${totalPrice.toLocaleString("pt-BR")}`, {
      activeAnimals: bezerrasAtivas.length,
      revenueId: revenue.id,
      revenueAmount: revenueAmountReais,
    });

    return { name: "Teste 4", success: true, message: `Venda de ${quantity} animais registrada com receita financeira` };
  } catch (error) {
    return { name: "Teste 4", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 5: Cálculo de Métricas Financeiras
 */
function test5_FinancialMetrics(): TestResult {
  try {
    console.log("\n📋 [TEST 5] Calculando métricas financeiras...");
    
    const startDate = "2025-01-01";
    const endDate = "2025-12-31";
    const metrics = financialCalculations.calculateMetrics(startDate, endDate);

    // Verificar receitas
    const expectedRevenue = 100000; // R$ 100.000 da venda (em centavos)
    if (metrics.receitaBruta !== expectedRevenue) {
      return { name: "Teste 5", success: false, message: `Receita esperada: ${expectedRevenue} centavos, encontrada: ${metrics.receitaBruta}` };
    }

    // Verificar investimentos
    const expectedInvestment = 15000000; // R$ 150.000 da compra (em centavos)
    if (metrics.investimentos !== expectedInvestment) {
      return { name: "Teste 5", success: false, message: `Investimento esperado: ${expectedInvestment} centavos, encontrado: ${metrics.investimentos}` };
    }

    // Verificar lucro líquido
    const expectedNetProfit = expectedRevenue - expectedInvestment; // -R$ 50.000 (negativo porque só vendeu parte)
    if (metrics.lucroLiquido !== expectedNetProfit) {
      return { name: "Teste 5", success: false, message: `Lucro líquido esperado: ${expectedNetProfit} centavos, encontrado: ${metrics.lucroLiquido}` };
    }

    logTest("Métricas Financeiras", true, `Receita: R$ ${(metrics.receitaBruta / 100).toLocaleString("pt-BR")}, Investimento: R$ ${(metrics.investimentos / 100).toLocaleString("pt-BR")}, Lucro: R$ ${(metrics.lucroLiquido / 100).toLocaleString("pt-BR")}`, metrics);

    return { name: "Teste 5", success: true, message: "Métricas financeiras calculadas corretamente" };
  } catch (error) {
    return { name: "Teste 5", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 6: Registro de Despesa
 */
function test6_RegisterExpense(): TestResult {
  try {
    console.log("\n📋 [TEST 6] Registrando despesa...");
    
    const amount = 30000; // R$ 30.000 (primeira parcela)
    const date = "2026-01-14"; // 45 dias após 30/11/25
    const description = "Primeira parcela da compra de animais";

    const transaction = financialAPI.registerExpense(amount, description, date, "Compra de Animais");

    const transactions = transactionService.getAll();
    const expense = transactions.find(t => t.id === transaction.id);
    if (!expense) {
      return { name: "Teste 6", success: false, message: "Despesa não encontrada" };
    }

    const expenseAmountReais = expense.amount / 100;
    if (Math.abs(expenseAmountReais - amount) > 0.01) {
      return { name: "Teste 6", success: false, message: `Valor da despesa incorreto. Esperado R$ ${amount}, encontrado R$ ${expenseAmountReais}` };
    }

    logTest("Registrar Despesa", true, `Despesa de R$ ${amount.toLocaleString("pt-BR")} registrada`, {
      expenseId: expense.id,
      expenseAmount: expenseAmountReais,
    });

    return { name: "Teste 6", success: true, message: "Despesa registrada com sucesso" };
  } catch (error) {
    return { name: "Teste 6", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 7: Registro de Manejo de Pastagem
 */
function test7_RegisterPastureManagement(): TestResult {
  try {
    console.log("\n📋 [TEST 7] Registrando manejo de pastagem...");
    
    const pastures = pastureService.getAll();
    if (pastures.length === 0) {
      return { name: "Teste 7", success: false, message: "Nenhum pasto encontrado" };
    }

    const pasture = pastures[0];
    const cost = 5000; // R$ 5.000
    const date = "2025-12-01";

    const result = pastureFinancialIntegration.registerMaintenance(
      pasture.id,
      cost,
      date,
      "Adubação e correção do solo"
    );

    // Verificar se despesa foi criada
    const transactions = transactionService.getAll();
    const expense = transactions.find(t => t.id === result.financialTransactionId);
    if (!expense) {
      return { name: "Teste 7", success: false, message: "Despesa de manejo não encontrada" };
    }

    const expenseAmountReais = expense.amount / 100;
    if (Math.abs(expenseAmountReais - cost) > 0.01) {
      return { name: "Teste 7", success: false, message: `Valor da despesa incorreto. Esperado R$ ${cost}, encontrado R$ ${expenseAmountReais}` };
    }

    logTest("Registrar Manejo", true, `Manejo de R$ ${cost.toLocaleString("pt-BR")} registrado`, {
      pastureName: pasture.name,
      expenseId: expense.id,
    });

    return { name: "Teste 7", success: true, message: "Manejo de pastagem registrado com despesa financeira" };
  } catch (error) {
    return { name: "Teste 7", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 8: Cálculo de Métricas do Rebanho
 */
function test8_LivestockMetrics(): TestResult {
  try {
    console.log("\n📋 [TEST 8] Calculando métricas do rebanho...");
    
    const metrics = livestockCalculations.calculateMetrics();

    // Verificar total de animais (deve ser 50 após venda de 50)
    if (metrics.totalAnimals !== 50) {
      return { name: "Teste 8", success: false, message: `Total de animais esperado: 50, encontrado: ${metrics.totalAnimals}` };
    }

    // Verificar valor patrimonial (50 bezerras × R$ 1.500 = R$ 75.000)
    const expectedValue = 50 * 1500 * 100; // em centavos
    const tolerance = expectedValue * 0.1; // 10% de tolerância
    if (Math.abs(metrics.totalValue - expectedValue) > tolerance) {
      return { name: "Teste 8", success: false, message: `Valor patrimonial esperado: ~${expectedValue} centavos, encontrado: ${metrics.totalValue}` };
    }

    logTest("Métricas do Rebanho", true, `Total: ${metrics.totalAnimals} animais, Valor: R$ ${(metrics.totalValue / 100).toLocaleString("pt-BR")}`, metrics);

    return { name: "Teste 8", success: true, message: "Métricas do rebanho calculadas corretamente" };
  } catch (error) {
    return { name: "Teste 8", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 9: Verificar UA Após Venda
 */
function test9_UAAfterSale(): TestResult {
  try {
    console.log("\n📋 [TEST 9] Verificando UA após venda...");
    
    const balance = pastureCalculations.calculateBalance();
    
    // Após vender 50 bezerras, devem restar 50
    // 50 bezerras × 0.2 UA = 10 UA
    const expectedUA = 50 * 0.2; // 10 UA
    if (Math.abs(balance.currentUA - expectedUA) > 0.01) {
      return { name: "Teste 9", success: false, message: `UA esperada após venda: ${expectedUA}, encontrada: ${balance.currentUA}` };
    }

    logTest("UA Após Venda", true, `UA atual: ${balance.currentUA} (esperado: ${expectedUA})`, balance);

    return { name: "Teste 9", success: true, message: "UA recalculada corretamente após venda" };
  } catch (error) {
    return { name: "Teste 9", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Teste 10: Validação de Integridade de Dados
 */
function test10_DataIntegrity(): TestResult {
  try {
    console.log("\n📋 [TEST 10] Validando integridade de dados...");
    
    const errors: string[] = [];

    // Verificar consistência de transações financeiras
    const transactions = transactionService.getAll();
    const transactionsWithInvalidAmounts = transactions.filter(t => t.amount <= 0);
    if (transactionsWithInvalidAmounts.length > 0) {
      errors.push(`${transactionsWithInvalidAmounts.length} transações com valores inválidos`);
    }

    // Verificar consistência de animais
    const animals = animalService.getAll();
    const animalsWithoutCategory = animals.filter(a => !a.categoryId);
    if (animalsWithoutCategory.length > 0) {
      errors.push(`${animalsWithoutCategory.length} animais sem categoria`);
    }

    // Verificar consistência de pastos
    const pastures = pastureService.getAll();
    const pasturesWithInvalidArea = pastures.filter(p => p.area <= 0);
    if (pasturesWithInvalidArea.length > 0) {
      errors.push(`${pasturesWithInvalidArea.length} pastos com área inválida`);
    }

    if (errors.length > 0) {
      return { name: "Teste 10", success: false, message: "Problemas de integridade encontrados", errors };
    }

    logTest("Integridade de Dados", true, "Todos os dados estão consistentes", {
      transactions: transactions.length,
      animals: animals.length,
      pastures: pastures.length,
    });

    return { name: "Teste 10", success: true, message: "Integridade de dados validada" };
  } catch (error) {
    return { name: "Teste 10", success: false, message: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}

/**
 * Executar todos os testes
 */
export async function runE2ETests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}> {
  console.log("\n🧪 ========== INICIANDO TESTES END-TO-END ==========\n");
  
  testResults.length = 0; // Limpar resultados anteriores
  
  // Limpar dados
  clearAllData();
  
  // Executar testes em sequência
  testResults.push(test1_RegisterPastures());
  testResults.push(test2_PurchaseAnimals());
  testResults.push(test3_CalculateUAAndStocking());
  testResults.push(test4_SellAnimals());
  testResults.push(test5_FinancialMetrics());
  testResults.push(test6_RegisterExpense());
  testResults.push(test7_RegisterPastureManagement());
  testResults.push(test8_LivestockMetrics());
  testResults.push(test9_UAAfterSale());
  testResults.push(test10_DataIntegrity());
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  const total = testResults.length;
  
  console.log("\n📊 ========== RESULTADOS DOS TESTES ==========");
  console.log(`Total: ${total} | ✅ Passou: ${passed} | ❌ Falhou: ${failed}`);
  
  if (failed > 0) {
    console.log("\n❌ Testes que falharam:");
    testResults.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
      if (r.errors) {
        r.errors.forEach(e => console.log(`     • ${e}`));
      }
    });
  }
  
  return {
    total,
    passed,
    failed,
    results: testResults,
  };
}

