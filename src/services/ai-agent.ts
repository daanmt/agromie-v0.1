/**
 * Agente de IA Unificado - AgrOmie
 * Conversa naturalmente com o produtor e executa ações automaticamente
 */

import { financialAPI, transactionService } from "./financial";
import { livestockFinancialIntegration, categoryService, animalService } from "./livestock";
import { pastureFinancialIntegration, pastureService } from "./pasture";
import { LivestockCategory } from "@/types/livestock";
import { PastureType, PastureStatus, ManagementType } from "@/types/pasture";
import { TransactionType } from "@/types/financial";
import { storage, STORAGE_KEYS } from "@/lib/storage";

const SYSTEM_PROMPT = `Você é o Assistente AgrOmie, um ajudante virtual simples, amigável e direto, que conversa com o produtor rural sem termos técnicos.

Sua missão é entender o que o usuário quer, executar as ações necessárias no ERP AgrOmie e confirmar o resultado de um jeito humano e claro.

O usuário NUNCA deve ver JSON, intents, nomes de funções ou detalhes técnicos. Somente o seu sistema interno (hidden) deve receber as ações estruturadas.

🎯 O QUE VOCÊ FAZ

Para cada mensagem do produtor:
1. Converse naturalmente (linguagem simples, acolhedora e objetiva)
2. Entenda a intenção (intent)
3. Extraia entidades necessárias
4. Gere o comando interno para o backend (JSON interno oculto)
5. Execute
6. Confirme para o produtor de forma humana e clara

📋 REGRAS DE COMPORTAMENTO

1. Seja direto e objetivo. Economize tokens.

2. Para consultas: SEMPRE retorne dados estruturados (tabelas, listas)

3. Para registros: Confirme a ação com os valores registrados

4. Evite explicações longas. Vá direto ao ponto.

5. Se o usuário pede dados, mostre os dados. Não redirecione para dashboard.

6. INTEGRAÇÃO AUTOMÁTICA ENTRE MÓDULOS:
   - Quando você registra uma VENDA de animais → uma RECEITA é criada automaticamente no módulo financeiro
   - Quando você registra uma COMPRA de animais → uma DESPESA ou INVESTIMENTO é criada automaticamente no módulo financeiro
   - Quando você registra manejo de pastagem com custo → uma DESPESA é criada automaticamente no módulo financeiro
   - Se o usuário perguntar sobre "ajuste no financeiro" ou "e o financeiro?" após uma venda/compra, SEMPRE confirme que já foi feito automaticamente
   - Exemplo: "Vendi 50 bezerras" → "Venda registrada! A receita de R$ X já foi registrada automaticamente no financeiro."

Exemplos de resposta boa:
- "qual o tamanho do rebanho?" → "410 animais no total"
- "liste por sexo" → Tabela com categorias, sexo e quantidade
- "registrei 100 bezerras" → "100 bezerras registradas ✓"
- "vendi 50 bezerras por R$ 119.000" → "Venda de 50 animais registrada! Valor total: R$ 119.000,00. A receita já foi registrada automaticamente no financeiro."
- "E o ajuste no módulo financeiro?" (após venda) → "Já foi feito automaticamente! A receita de R$ X foi registrada quando você vendeu os animais."

🧠 COMO FUNCIONA SUA LÓGICA INTERNA

Você opera em dois níveis:

🟦 1. Nível externo (visível ao produtor)
- Conversa natural
- Sem código
- Sem detalhes técnicos
- Apenas mensagens humanas

🟩 2. Nível interno (invisível ao produtor)

Você SEMPRE envia internamente, junto com a sua resposta humana, uma estrutura invisível no formato:

{
  "intent": "<intent>",
  "entities": { ... },
  "metadata": {
    "interpreted_from": "<mensagem original>"
  }
}

Essa parte é oculta, o usuário nunca vê.

🧱 INTENTS INTERNOS (INVISÍVEIS)

- registrar_receita
- registrar_despesa
- registrar_investimento
- registrar_pró_labore
- registrar_compra_animais
- registrar_venda_animais
- registrar_nascimento
- registrar_morte
- registrar_pesagem
- registrar_inventario_rebanho (NOVO: para animais já existentes na fazenda, sem compra)
- registrar_movimentacao_rebanho
- registrar_area_pasto
- registrar_manejo_pasto
- operacao_complexa_rebanho (para operações que envolvem múltiplas pastagens + compra de animais + distribuição)
- consultar_financeiro
- consultar_rebanho
- consultar_rebanho_detalhado (retorna lista completa com categorias, sexo, idade)
- consultar_rebanho_por_sexo (agrupa animais por sexo)
- consultar_rebanho_por_categoria (agrupa por categoria zootécnica)
- consultar_pastagens
- consultar_margens
- limpar_cache (limpa localStorage do navegador)
- resetar_dados (exclui todos os dados do sistema)
- resetar_rebanho (exclui apenas dados do rebanho)
- resetar_financeiro (exclui apenas dados financeiros)
- resetar_pastagens (exclui apenas dados de pastagens)

Mas você nunca mostra esses nomes ao usuário.

🔍 REGRAS DE INTERPRETAÇÃO

1. Quando houver valor monetário + animais → sempre é COMPRA
   - "entraram", "chegaram", "adquiri", "investido", "valor investido" → indica COMPRA
   - Se menciona valor/preço/custo → é COMPRA, não inventário

2. "identifiquei", "já tenho", "existentes", "já estavam" → indica INVENTÁRIO
   - Apenas quando NÃO há valor/preço mencionado
   - Se houver valor junto → é COMPRA

3. Em caso de dúvida sobre origem dos animais → assuma COMPRA se houver valor
   - Valor monetário é o indicador mais forte de compra
   - Sem valor → pode ser inventário

4. Para operações complexas (múltiplas pastagens + animais + valor):
   - Use o intent "operacao_complexa_rebanho" quando houver:
     * Múltiplas pastagens mencionadas
     * Compra de animais com valor
     * Distribuição de animais entre pastos
   - Estruture as entities com:
     * pastos: array de objetos {nome, area}
     * total_animais: quantidade total
     * categoria: categoria zootécnica
     * valor: valor total em centavos
     * distribuicao: array com quantidade por pasto (opcional)
     * peso_medio: peso médio em kg (opcional)
     * date: data da operação
   - Execute automaticamente sem pedir confirmações

🔍 REGRAS DE DETECÇÃO DE INTENT (PRIORIDADE)

1. INVENTÁRIO DE REBANHO (registrar_inventario_rebanho):
   - Use quando o produtor menciona animais que JÁ ESTAVAM na fazenda
   - Palavras-chave: "identifiquei", "já estavam", "fora do ERP", "já tinha", "já possuía", "estoque inicial", "inventário", "cadastrar animais que já tenho", "incluir animais existentes"
   - NÃO exige valor/preço
   - Exige apenas: quantidade, categoria, data (opcional, padrão hoje)
   - IMPORTANTE: Se houver valor/preço mencionado → NÃO use este intent, use registrar_compra_animais

2. COMPRA DE ANIMAIS (registrar_compra_animais):
   - Use quando há indicação de COMPRA (verbo "comprar", "comprei", "adquiri", "paguei por")
   - OU quando há valor/preço mencionado (PRIORIDADE MÁXIMA)
   - OU quando há palavras: "entraram", "chegaram", "investido", "valor investido"
   - OU quando há vendedor mencionado
   - Exige: quantidade, valor, categoria, data

3. NASCIMENTO (registrar_nascimento):
   - Use quando há indicação de nascimento ("nasceram", "nascimento", "parto")
   - NÃO exige valor
   - Exige: quantidade, categoria (opcional, padrão BEZERRO), data

IMPORTANTE: Se a mensagem menciona animais já existentes SEM indicação de compra/preço, SEMPRE use registrar_inventario_rebanho, NÃO registrar_compra_animais. MAS se houver valor/preço mencionado, SEMPRE use registrar_compra_animais.

📋 FORMATO DE RESPOSTA

Você deve retornar APENAS um JSON válido com dois campos:

{
  "response": "Sua resposta humana e natural para o produtor",
  "action": {
    "intent": "registrar_despesa",
    "entities": {
      "valor": 32000,
      "descricao": "sal proteinado",
      "date": "2025-01-14"
    },
    "metadata": {
      "interpreted_from": "Paguei 320 reais de sal proteinado ontem."
    }
  }
}

Para múltiplas ações:
{
  "response": "Sua resposta humana",
  "actions": [
    {
      "intent": "registrar_venda_animais",
      "entities": { ... }
    },
    {
      "intent": "registrar_despesa",
      "entities": { ... }
    }
  ],
  "metadata": {
    "interpreted_from": "..."
  }
}

Se faltar informação crítica:
{
  "response": "Sua pergunta humana e simples",
  "action": {
    "intent": "solicitar_dados",
    "entities": {
      "dados_faltantes": ["valor", "date"],
      "mensagem": "Preciso saber o valor e a data."
    }
  }
}

❗ REGRAS IMPORTANTES:
- Valores monetários sempre em CENTAVOS (ex: R$ 320 = 32000, R$ 8.000 = 800000, R$ 120.000 = 12000000)
- Datas no formato YYYY-MM-DD
- Se data não informada, use a data de hoje no formato YYYY-MM-DD
- Categorias zootécnicas: VACA, NOVILHA, BEZERRO, BEZERRA, BOI_MAGRO, BOI_GORDO, TOURO, TOURUNO
- NUNCA invente dados numéricos
- NUNCA mostre código, JSON, intent, backend ao usuário
- NUNCA explique como funciona o sistema
- NUNCA diga "não reconheci o intent"
- Sempre responda de forma humana e natural
- NUNCA exija valor/preço para registrar_inventario_rebanho (inventário não tem valor)
- NUNCA exija valor/preço para registrar_nascimento (nascimento não tem valor)

💰 CÁLCULO DE VALORES COM ARROBA (@):
- 1 arroba (@) = 15 kg
- Quando o usuário menciona "X reais o arroba" ou "X por @", significa o preço por arroba
- Quando menciona "peso médio Y@" ou "Y@ cada", significa Y arrobas por animal
- Para calcular o valor total da venda:
  * Valor total = quantidade × peso_medio_arroba × preco_por_arroba
  * Exemplo: "Vendi 50 bezerras por 340 o arroba, peso médio 7@ cada"
    → quantidade: 50
    → peso_medio_arroba: 7
    → preco_por_arroba: 340
    → valor_total = 50 × 7 × 340 = 119.000 reais = 11900000 centavos
- Sempre calcule o valor total e inclua em "entities.valor" (em centavos)
- Inclua também "peso_medio" em kg (peso_medio_arroba × 15) e "peso_medio_arroba" nas entities

🌾 IDENTIFICAÇÃO DE PASTOS NA VENDA:
- Quando o usuário menciona pastos na venda (ex: "15 do pasto 1", "35 do pasto 2"), extraia essas informações
- Se o usuário pedir para editar o nome de um pasto (ex: "pasto 1 (da sede - edite o nome por favor)"), extraia:
  * pastos: array de objetos com {nome, quantidade, novo_nome}
  * Exemplo: "vendi 50 bezerras. 15 do pasto 1 (da sede - edite o nome por favor) e 35 do pasto 2 (do coqueiro - edite o nome por favor)"
    → pastos: [
        {nome: "pasto 1", quantidade: 15, novo_nome: "da sede"},
        {nome: "pasto 2", quantidade: 35, novo_nome: "do coqueiro"}
      ]
- O sistema irá buscar os pastos por nome e atualizar os nomes automaticamente
- Se o pasto não for encontrado, o sistema tentará match parcial (ex: "pasto 1" encontra "Pasto 1")

📝 EXEMPLOS DE INTERPRETAÇÃO:

Exemplo 1 - INVENTÁRIO (sem valor):
Entrada: "identifiquei 100 animais que já estavam na fazenda, são 100 bezerras"
Saída:
{
  "response": "Perfeito! Já registrei as 100 bezerras no seu rebanho.",
  "action": {
    "intent": "registrar_inventario_rebanho",
    "entities": {
      "quantidade": 100,
      "categoria": "BEZERRA",
      "date": "2025-01-15"
    }
  }
}

Exemplo 2 - COMPRA (com valor):
Entrada: "esses animais entraram com 6@ de média por cabeça e o valor investido foi 150 mil"
Saída:
{
  "response": "Registrei a compra dos animais por R$ 150.000,00.",
  "action": {
    "intent": "registrar_compra_animais",
    "entities": {
      "quantidade": 100,
      "categoria": "BEZERRO",
      "valor": 15000000,
      "date": "2025-01-15"
    }
  }
}

Exemplo 3 - OPERAÇÃO COMPLEXA (intent único):
Entrada: "registrei 100 animais divididos em 2 pastagens, comprados por 150 mil. Pasto da sede tem 40 ha e Pasto do coqueiro tem 40 ha"
Saída:
{
  "response": "Pronto! Registrei as 2 pastagens, a compra dos 100 animais por R$ 150.000,00 e a distribuição entre os pastos.",
  "action": {
    "intent": "operacao_complexa_rebanho",
    "entities": {
      "pastos": [
        {"nome": "pasto da sede", "area": 40},
        {"nome": "pasto do coqueiro", "area": 40}
      ],
      "total_animais": 100,
      "categoria": "BEZERRO",
      "valor": 15000000,
      "distribuicao": [50, 50],
      "peso_medio": 180,
      "date": "2025-01-15"
    }
  }
}

Entrada: "quero inserir 80 vacas que já tenho"
Saída:
{
  "response": "Certo! Já cadastrei as 80 vacas no sistema.",
  "action": {
    "intent": "registrar_inventario_rebanho",
    "entities": {
      "quantidade": 80,
      "categoria": "VACA",
      "date": "2025-01-15"
    }
  }
}

Entrada: "meu inventário inicial tem 50 bezerras"
Saída:
{
  "response": "Pronto! Registrei as 50 bezerras do seu inventário inicial.",
  "action": {
    "intent": "registrar_inventario_rebanho",
    "entities": {
      "quantidade": 50,
      "categoria": "BEZERRA",
      "date": "2025-01-15"
    }
  }
}

Exemplo 4 - PERGUNTA SOBRE INTEGRAÇÃO FINANCEIRA (após venda/compra):
Entrada: "E o ajuste no módulo financeiro?" (após ter vendido animais)
Saída:
{
  "response": "Já foi feito automaticamente! Quando você vendeu os animais, a receita foi registrada automaticamente no financeiro. Não precisa fazer nada.",
  "action": {
    "intent": "consultar_financeiro",
    "entities": {}
  }
}

IMPORTANTE: Se o usuário perguntar sobre "ajuste financeiro", "e o financeiro?", "registrou no financeiro?" após uma venda/compra, SEMPRE confirme que já foi feito automaticamente. NÃO crie uma nova transação financeira, apenas confirme que a integração automática já funcionou.

Retorne APENAS o JSON, sem markdown, sem explicações adicionais.`;

export interface AIAgentResponse {
  response: string; // Resposta humana visível ao usuário
  action?: {
    intent: string;
    entities: Record<string, any>;
  };
  actions?: Array<{
    intent: string;
    entities: Record<string, any>;
  }>;
  metadata?: {
    interpreted_from: string;
  };
}

export interface AIAgentResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Função auxiliar para converter string em LivestockCategory enum
 */
function parseLivestockCategory(categoriaStr: string | undefined): LivestockCategory | null {
  if (!categoriaStr) return null;
  
  const upper = String(categoriaStr).toUpperCase().trim();
  
  const validCategories: string[] = ["VACA", "NOVILHA", "BEZERRO", "BEZERRA", "BOI_MAGRO", "BOI_GORDO", "TOURO", "TOURUNO"];
  
  if (validCategories.includes(upper)) {
    return upper as LivestockCategory;
  }
  
  return null;
}

/**
 * Executar uma ação baseada no intent
 */
export async function executeAction(intent: string, entities: Record<string, any>): Promise<AIAgentResult> {
  console.log(`\n🔵 ========== EXECUTANDO AÇÃO ==========`);
  console.log(`📋 Intent: ${intent}`);
  console.log(`📦 Entities:`, JSON.stringify(entities, null, 2));
  
  try {
    // Garantir inicialização
    categoryService.initializeDefault();
    console.log(`✅ Serviços inicializados`);

    switch (intent) {
      // ========== FINANCEIRO ==========
      case "registrar_receita": {
        if (!entities.valor) {
          return {
            success: false,
            message: "Preciso saber o valor da receita.",
          };
        }

        const result = financialAPI.registerRevenue(
          entities.valor / 100,
          entities.descricao || "Receita registrada via assistente",
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.grupo_plano_contas || "Receitas"
        );

        return {
          success: true,
          message: `Receita de ${(entities.valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} registrada!`,
          data: result,
        };
      }

      case "registrar_despesa": {
        if (!entities.valor) {
          return {
            success: false,
            message: "Preciso saber o valor da despesa.",
          };
        }

        try {
          // O valor vem em centavos do LLM, converter para reais
          const valorEmReais = entities.valor / 100;
          console.log(`💰 Registrando despesa: ${valorEmReais} reais (${entities.valor} centavos)`);
          
          const result = financialAPI.registerExpense(
            valorEmReais,
            entities.descricao || "Despesa registrada via assistente",
            entities.date || entities.data || new Date().toISOString().split("T")[0],
            entities.grupo_plano_contas || "Despesas"
          );

          console.log(`✅ Despesa registrada com sucesso:`, result);

          return {
            success: true,
            message: `Despesa de ${valorEmReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} registrada!`,
            data: result,
          };
        } catch (error) {
          console.error("❌ Erro ao registrar despesa:", error);
          return {
            success: false,
            message: `Erro ao registrar despesa: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "registrar_investimento": {
        if (!entities.valor) {
          return {
            success: false,
            message: "Preciso saber o valor do investimento.",
          };
        }

        const result = financialAPI.registerInvestment(
          entities.valor / 100,
          entities.descricao || "Investimento registrado via assistente",
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.grupo_plano_contas || "Investimentos"
        );

        return {
          success: true,
          message: `Investimento de ${(entities.valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} registrado!`,
          data: result,
        };
      }

      case "registrar_pró_labore": {
        if (!entities.valor) {
          return {
            success: false,
            message: "Preciso saber o valor do pró-labore.",
          };
        }

        const result = transactionService.create({
          type: TransactionType.RETIRADA,
          amount: entities.valor,
          description: entities.descricao || "Pró-labore registrado via assistente",
          date: entities.date || entities.data || new Date().toISOString().split("T")[0],
          accountId: "",
        });

        return {
          success: true,
          message: `Pró-labore de ${(entities.valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} registrado!`,
          data: result,
        };
      }

      // ========== REBANHO ==========
      case "registrar_compra_animais": {
        // Compra exige valor (é uma transação financeira)
        if (!entities.quantidade) {
          return {
            success: false,
            message: "Quantos animais você comprou?",
          };
        }

        if (!entities.valor && !entities.preco_unitario && !entities.preco) {
          return {
            success: false,
            message: "Qual foi o valor total ou o preço por cabeça?",
          };
        }

        let categoryId = "";
        if (entities.categoria) {
          try {
            const categoryEnum = parseLivestockCategory(entities.categoria);
            if (categoryEnum) {
              const category = categoryService.getByCategory(categoryEnum);
              categoryId = category?.id || "";
            }
          } catch (error) {
            console.error("❌ Erro ao processar categoria:", error);
          }
        }

        if (!categoryId) {
          const categories = categoryService.getAll();
          categoryId = categories.find((c) => c.active)?.id || "";
        }

        if (!categoryId) {
          return {
            success: false,
            message: "Não consegui identificar a categoria. Pode ser mais específico? (bezerros, vacas, bois...)",
          };
        }

        // Calcular preço por cabeça
        let pricePerHeadReais = 0;
        let totalValue = 0;
        
        if (entities.valor) {
          // Valor total fornecido (em centavos)
          totalValue = entities.valor / 100;
          pricePerHeadReais = totalValue / entities.quantidade;
        } else if (entities.preco_unitario) {
          // Preço unitário fornecido (em centavos)
          pricePerHeadReais = entities.preco_unitario / 100;
          totalValue = pricePerHeadReais * entities.quantidade;
        } else if (entities.preco) {
          // Preço fornecido (em centavos)
          pricePerHeadReais = entities.preco / 100;
          totalValue = pricePerHeadReais * entities.quantidade;
        }

        try {
          console.log(`🐄 Registrando compra: ${entities.quantidade} animais, preço por cabeça: R$ ${pricePerHeadReais}, total: R$ ${totalValue}`);
          
          const result = livestockFinancialIntegration.registerPurchase(
            categoryId,
            entities.quantidade,
            pricePerHeadReais,
            entities.date || entities.data || new Date().toISOString().split("T")[0],
            entities.descricao || `Compra de ${entities.quantidade} animais`
          );

          console.log(`✅ Compra registrada com sucesso:`, result);

          return {
            success: true,
            message: `Compra de ${entities.quantidade} animais registrada! Valor total: ${totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. A despesa já foi registrada automaticamente no módulo financeiro.`,
            data: result,
          };
        } catch (error) {
          console.error("❌ Erro ao registrar compra:", error);
          return {
            success: false,
            message: `Erro ao registrar compra: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "registrar_venda_animais": {
        console.log(`💰 [SALE] Entities recebidas:`, entities);
        
        // Calcular valor total se houver arroba
        let valorTotalCentavos = entities.valor;
        
        if (entities.peso_medio_arroba && entities.preco_por_arroba && entities.quantidade) {
          // Cálculo por arroba: quantidade × peso_medio_arroba × preco_por_arroba
          const valorTotalReais = entities.quantidade * entities.peso_medio_arroba * entities.preco_por_arroba;
          valorTotalCentavos = Math.round(valorTotalReais * 100);
          console.log(`💰 [SALE] Calculado por arroba: ${entities.quantidade} × ${entities.peso_medio_arroba}@ × R$ ${entities.preco_por_arroba}/@ = R$ ${valorTotalReais} (${valorTotalCentavos} centavos)`);
        } else if (entities.peso_medio && entities.preco_por_arroba && entities.quantidade) {
          // Se peso_medio está em kg, converter para arrobas (1@ = 15kg)
          const pesoMedioArroba = entities.peso_medio / 15;
          const valorTotalReais = entities.quantidade * pesoMedioArroba * entities.preco_por_arroba;
          valorTotalCentavos = Math.round(valorTotalReais * 100);
          console.log(`💰 [SALE] Calculado por arroba (peso em kg): ${entities.quantidade} × ${pesoMedioArroba.toFixed(2)}@ × R$ ${entities.preco_por_arroba}/@ = R$ ${valorTotalReais} (${valorTotalCentavos} centavos)`);
        }
        
        if (!entities.quantidade || !valorTotalCentavos) {
          return {
            success: false,
            message: "Preciso saber quantos animais e o valor total (ou preço por arroba e peso médio).",
          };
        }

        let categoryId = "";
        if (entities.categoria) {
          try {
            const categoryEnum = parseLivestockCategory(entities.categoria);
            if (categoryEnum) {
              const category = categoryService.getByCategory(categoryEnum);
              categoryId = category?.id || "";
            }
          } catch (error) {
            console.error("❌ Erro ao processar categoria:", error);
          }
        }

        if (!categoryId) {
          const categories = categoryService.getAll();
          categoryId = categories.find((c) => c.active)?.id || "";
        }

        if (!categoryId) {
          return {
            success: false,
            message: "Não consegui identificar a categoria. Pode ser mais específico?",
          };
        }

        // Processar informações sobre pastos mencionados
        const pastureUpdates: Array<{ pastureId: string; newName: string }> = [];
        const pastureDistributions: Array<{ pastureId: string; quantity: number }> = [];
        
        // Se houver informações sobre pastos na venda
        if (entities.pastos && Array.isArray(entities.pastos)) {
          console.log(`🌾 [SALE] Processando informações de pastos:`, entities.pastos);
          
          for (const pastoInfo of entities.pastos) {
            const pastureName = pastoInfo.nome || pastoInfo.name || pastoInfo.pasto;
            const newName = pastoInfo.novo_nome || pastoInfo.novoNome;
            const quantity = pastoInfo.quantidade || pastoInfo.qtd;
            
            if (pastureName) {
              // Buscar pasto por nome
              const pasture = pastureService.getByName(pastureName);
              
              if (pasture) {
                // Atualizar nome se solicitado
                if (newName && newName.trim() !== "" && newName.trim().toLowerCase() !== pasture.name.toLowerCase()) {
                  console.log(`✏️ [SALE] Atualizando nome do pasto "${pasture.name}" para "${newName}"`);
                  const updated = pastureService.update(pasture.id, { name: newName.trim() });
                  if (updated) {
                    pastureUpdates.push({ pastureId: pasture.id, newName: updated.name });
                    console.log(`✅ [SALE] Nome do pasto atualizado: ${updated.name}`);
                  }
                }
                
                // Registrar distribuição se houver quantidade
                if (quantity && quantity > 0) {
                  pastureDistributions.push({ pastureId: pasture.id, quantity });
                  console.log(`📊 [SALE] ${quantity} animais do pasto "${pasture.name || newName || pastureName}"`);
                }
              } else {
                console.warn(`⚠️ [SALE] Pasto "${pastureName}" não encontrado. Pastos disponíveis:`, pastureService.getAll().map(p => p.name));
              }
            }
          }
        }
        
        // Se houver apenas um pasto mencionado sem array
        if (!entities.pastos && entities.pasto) {
          const pasture = pastureService.getByName(entities.pasto);
          if (pasture) {
            if (entities.novo_nome_pasto) {
              const updated = pastureService.update(pasture.id, { name: entities.novo_nome_pasto.trim() });
              if (updated) {
                pastureUpdates.push({ pastureId: pasture.id, newName: updated.name });
              }
            }
            pastureDistributions.push({ pastureId: pasture.id, quantity: entities.quantidade });
          }
        }

        // Calcular preço por cabeça
        const pricePerHeadReais = (valorTotalCentavos / 100) / entities.quantidade;
        console.log(`💰 [SALE] Preço por cabeça: R$ ${pricePerHeadReais.toFixed(2)}`);

        const result = livestockFinancialIntegration.registerSale(
          categoryId,
          entities.quantidade,
          pricePerHeadReais,
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.descricao || `Venda de ${entities.quantidade} animais`,
          entities.animal_ids
        );

        const valorTotalReais = valorTotalCentavos / 100;
        
        // Construir mensagem de resposta
        let responseMessage = `Venda de ${entities.quantidade} animais registrada! Valor total: ${valorTotalReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. A receita já foi registrada automaticamente no módulo financeiro.`;
        
        if (pastureUpdates.length > 0) {
          const namesUpdated = pastureUpdates.map(u => u.newName).join(", ");
          responseMessage += ` Nomes dos pastos atualizados: ${namesUpdated}.`;
        }
        
        if (pastureDistributions.length > 0) {
          const distributions = pastureDistributions.map(d => {
            const pasture = pastureService.getById(d.pastureId);
            return `${d.quantity} de ${pasture?.name || "pasto"}`;
          }).join(", ");
          responseMessage += ` Animais vendidos: ${distributions}.`;
        }
        
        return {
          success: true,
          message: responseMessage,
          data: {
            ...result,
            pastureUpdates,
            pastureDistributions,
          },
        };
      }

      case "registrar_nascimento": {
        if (!entities.quantidade) {
          return {
            success: false,
            message: "Quantos animais nasceram?",
          };
        }

        let categoryId = "";
        if (entities.categoria) {
          const categoryEnum = parseLivestockCategory(entities.categoria);
          if (categoryEnum) {
            const category = categoryService.getByCategory(categoryEnum);
            categoryId = category?.id || "";
          }
        } else {
          const bezerroEnum = "BEZERRO" as LivestockCategory;
          const category = categoryService.getByCategory(bezerroEnum);
          categoryId = category?.id || "";
        }

        if (!categoryId) {
          const categories = categoryService.getAll();
          categoryId = categories.find((c) => c.active)?.id || "";
        }

        const result = livestockFinancialIntegration.registerBirth(
          categoryId,
          entities.quantidade,
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.descricao || `Nascimento de ${entities.quantidade} animais`,
          entities.mother_id
        );

        return {
          success: true,
          message: `Nascimento de ${entities.quantidade} animais registrado!`,
          data: result,
        };
      }

      case "registrar_morte": {
        if (!entities.animal_id) {
          return {
            success: false,
            message: "Qual animal faleceu?",
          };
        }

        const result = livestockFinancialIntegration.registerDeath(
          entities.animal_id,
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.descricao || "Morte registrada via assistente",
          entities.causa || "Causa não informada"
        );

        return {
          success: true,
          message: "Morte registrada!",
          data: result,
        };
      }

      case "registrar_pesagem": {
        if (!entities.animal_id || !entities.peso) {
          return {
            success: false,
            message: "Qual animal e qual o peso?",
          };
        }

        const result = livestockFinancialIntegration.registerWeight(
          entities.animal_id,
          entities.peso,
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.descricao || "Pesagem registrada via assistente"
        );

        return {
          success: true,
          message: `Pesagem de ${(entities.peso / 1000).toFixed(1)} kg registrada!`,
          data: result,
        };
      }

      case "registrar_inventario_rebanho": {
        // Inventário: animais já existentes na fazenda, sem compra, sem valor
        if (!entities.quantidade) {
          return {
            success: false,
            message: "Quantos animais você quer cadastrar?",
          };
        }

        let categoryId = "";
        if (entities.categoria) {
          try {
            const categoryEnum = parseLivestockCategory(entities.categoria);
            if (categoryEnum) {
              const category = categoryService.getByCategory(categoryEnum);
              categoryId = category?.id || "";
            }
          } catch (error) {
            console.error("❌ Erro ao processar categoria:", error);
          }
        }

        if (!categoryId) {
          const categories = categoryService.getAll();
          categoryId = categories.find((c) => c.active)?.id || "";
        }

        if (!categoryId) {
          return {
            success: false,
            message: "Não consegui identificar a categoria. Pode ser mais específico? (bezerros, vacas, bois...)",
          };
        }

        // Usar registerBirth para criar os animais (sem transação financeira)
        const result = livestockFinancialIntegration.registerBirth(
          categoryId,
          entities.quantidade,
          entities.date || entities.data || new Date().toISOString().split("T")[0],
          entities.descricao || `Inventário inicial: ${entities.quantidade} animais`
        );

        return {
          success: true,
          message: `${entities.quantidade} animais (${entities.categoria || "cadastrados"}) registrados no inventário!`,
          data: result,
        };
      }

      case "registrar_movimentacao_rebanho":
      case "registrar_movimentação_rebanho": {
        if (entities.tipo_movimentacao === "entrada" || entities.tipo === "entrada" || !entities.categoria_origem) {
          if (!entities.quantidade || !entities.categoria) {
            return {
              success: false,
              message: "Quantos animais e qual a categoria?",
            };
          }

          let categoryId = "";
          try {
            const categoryEnum = parseLivestockCategory(entities.categoria);
            if (categoryEnum) {
              const category = categoryService.getByCategory(categoryEnum);
              categoryId = category?.id || "";
            }
          } catch (error) {
            console.error("❌ Erro ao processar categoria:", error);
          }

          if (!categoryId) {
            const categories = categoryService.getAll();
            categoryId = categories.find((c) => c.active)?.id || "";
          }

          if (!categoryId) {
            return {
              success: false,
              message: "Não consegui identificar a categoria. Pode ser mais específico?",
            };
          }

          const result = livestockFinancialIntegration.registerBirth(
            categoryId,
            entities.quantidade,
            entities.date || entities.data || new Date().toISOString().split("T")[0],
            entities.descricao || `Registro de ${entities.quantidade} animais existentes no sistema`
          );

          return {
            success: true,
            message: `${entities.quantidade} animais (${entities.categoria}) registrados!`,
            data: result,
          };
        }

        return {
          success: false,
          message: "Movimentação interna ainda não está disponível.",
        };
      }

      // ========== OPERAÇÕES COMPLEXAS ==========
      case "operacao_complexa_rebanho": {
        console.log(`🔄 [COMPLEX] Iniciando operação complexa de rebanho...`);
        console.log(`📦 Entities recebidas:`, entities);
        
        const results: any[] = [];
        const errors: string[] = [];
        
        try {
          // 1. Validar dados obrigatórios
          if (!entities.pastos || !Array.isArray(entities.pastos) || entities.pastos.length === 0) {
            return {
              success: false,
              message: "Preciso saber quais pastagens registrar.",
            };
          }
          
          if (!entities.total_animais || entities.total_animais <= 0) {
            return {
              success: false,
              message: "Preciso saber a quantidade total de animais.",
            };
          }
          
          if (!entities.valor || entities.valor <= 0) {
            return {
              success: false,
              message: "Preciso saber o valor da compra.",
            };
          }
          
          // 2. Criar pastagens
          console.log(`🌾 [COMPLEX] Criando ${entities.pastos.length} pastagens...`);
          const createdPastures: any[] = [];
          
          for (const pasto of entities.pastos) {
            try {
              const pastureName = pasto.nome || pasto.name || `Pasto ${createdPastures.length + 1}`;
              const pastureArea = pasto.area || pasto.tamanho_ha || pasto.tamanho || 0;
              
              if (pastureArea <= 0) {
                errors.push(`Área inválida para ${pastureName}`);
                continue;
              }
              
              const capacityUA = 1.2; // Capacidade padrão: 1.2 UA/ha (não multiplicar pela área!)
              
              const resultPasto = pastureService.create({
                name: String(pastureName),
                area: Number(pastureArea),
                type: PastureType.BRAQUIARIA,
                status: PastureStatus.PRODUZINDO,
                capacityUA: capacityUA, // UA/ha, não UA total
              });
              
              createdPastures.push(resultPasto);
              results.push({ type: "pasture", data: resultPasto });
              console.log(`✅ [COMPLEX] Pastagem criada: ${pastureName} (${pastureArea} ha)`);
            } catch (error) {
              console.error(`❌ [COMPLEX] Erro ao criar pastagem ${pasto.nome}:`, error);
              errors.push(`Erro ao criar pastagem ${pasto.nome}: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
            }
          }
          
          // 3. Registrar compra de animais
          console.log(`🐄 [COMPLEX] Registrando compra de ${entities.total_animais} animais...`);
          
          let categoryId = "";
          if (entities.categoria) {
            try {
              const categoryEnum = parseLivestockCategory(entities.categoria);
              if (categoryEnum) {
                const category = categoryService.getByCategory(categoryEnum);
                categoryId = category?.id || "";
              }
            } catch (error) {
              console.error("❌ Erro ao processar categoria:", error);
            }
          }
          
          if (!categoryId) {
            const categories = categoryService.getAll();
            categoryId = categories.find((c) => c.active)?.id || "";
          }
          
          if (!categoryId) {
            return {
              success: false,
              message: "Não consegui identificar a categoria dos animais. Pode ser mais específico?",
            };
          }
          
          const valorEmReais = entities.valor / 100; // Converter centavos para reais
          const pricePerHeadReais = valorEmReais / entities.total_animais;
          
          try {
            const resultCompra = livestockFinancialIntegration.registerPurchase(
              categoryId,
              entities.total_animais,
              pricePerHeadReais,
              entities.date || entities.data || new Date().toISOString().split("T")[0],
              `Compra de ${entities.total_animais} animais - Operação complexa`
            );
            
            results.push({ type: "purchase", data: resultCompra });
            console.log(`✅ [COMPLEX] Compra registrada: ${entities.total_animais} animais por R$ ${valorEmReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`);
          } catch (error) {
            console.error(`❌ [COMPLEX] Erro ao registrar compra:`, error);
            errors.push(`Erro ao registrar compra: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
          }
          
          // 4. Distribuir animais entre pastos (se houver distribuição específica)
          if (entities.distribuicao && Array.isArray(entities.distribuicao) && entities.distribuicao.length > 1) {
            console.log(`🔄 [COMPLEX] Distribuindo animais entre pastos...`);
            // Nota: A movimentação entre pastos pode ser implementada no futuro
            // Por enquanto, apenas registramos que os animais foram distribuídos
            console.log(`ℹ️ [COMPLEX] Distribuição: ${entities.distribuicao.join(", ")} animais por pasto`);
          }
          
          // Resumo final
          const successCount = results.length;
          const totalOperations = entities.pastos.length + 1; // pastagens + compra
          
          if (errors.length > 0) {
            return {
              success: successCount > 0,
              message: `Operação parcialmente concluída: ${successCount} de ${totalOperations} operações. ${errors.join("; ")}`,
              data: results,
              errors: errors,
            };
          }
          
          return {
            success: true,
            message: `Operação completa: ${createdPastures.length} pastagens criadas, ${entities.total_animais} animais comprados por ${valorEmReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ✓`,
            data: results,
          };
        } catch (error) {
          console.error(`❌ [COMPLEX] Erro geral na operação complexa:`, error);
          return {
            success: false,
            message: `Erro ao processar operação complexa: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      // ========== PASTAGENS ==========
      case "registrar_area_pasto": {
        console.log(`🌾 [PASTURE] Tentando registrar área de pasto...`);
        console.log(`📦 Entities recebidas:`, entities);
        
        // Aceitar múltiplos formatos de nome
        const nome = entities.nome || entities.name || entities.pastagem || entities.pasto;
        // Aceitar múltiplos formatos de área
        const area = entities.area || entities.tamanho_ha || entities.tamanho || entities.ha || entities.hectares;
        
        if (!nome) {
          console.warn(`⚠️ [PASTURE] Nome da pastagem não encontrado`);
          return {
            success: false,
            message: "Preciso saber o nome da pastagem.",
          };
        }
        
        if (!area || (typeof area === 'number' && area <= 0)) {
          console.warn(`⚠️ [PASTURE] Área inválida:`, area);
          return {
            success: false,
            message: "Preciso saber a área em hectares (deve ser maior que zero).",
          };
        }
        
        // Converter área para número se necessário
        const areaNum = typeof area === 'number' ? area : parseFloat(String(area));
        if (isNaN(areaNum) || areaNum <= 0) {
          console.warn(`⚠️ [PASTURE] Área não é um número válido:`, area);
          return {
            success: false,
            message: "A área deve ser um número válido maior que zero.",
          };
        }
        
        // Parse do tipo de pastagem
        let pastureType = PastureType.BRAQUIARIA;
        if (entities.tipo) {
          const tipoUpper = String(entities.tipo).toUpperCase();
          if (Object.values(PastureType).includes(tipoUpper as PastureType)) {
            pastureType = tipoUpper as PastureType;
          }
        }
        
        // Parse do status
        let pastureStatus: PastureStatus = PastureStatus.PRODUZINDO;
        if (entities.status) {
          const statusUpper = String(entities.status).toUpperCase();
          if (Object.values(PastureStatus).includes(statusUpper as PastureStatus)) {
            pastureStatus = statusUpper as PastureStatus;
          }
        }
        
        // Calcular capacidade padrão se não fornecida (1.2 UA/ha é um valor padrão conservador)
        // A capacidade é em UA/ha, não UA total
        const capacityUA = entities.capacidade_suporte || entities.capacidade_ua || entities.capacity || 1.2;
        const capacityUANum = typeof capacityUA === 'number' ? capacityUA : parseFloat(String(capacityUA));
        const finalCapacityUA = isNaN(capacityUANum) || capacityUANum <= 0 ? 1.2 : capacityUANum;
        
        console.log(`🌾 [PASTURE] Criando pastagem:`, {
          nome,
          area: areaNum,
          tipo: pastureType,
          status: pastureStatus,
          capacityUA: finalCapacityUA
        });
        
        try {
          const result = pastureService.create({
            name: String(nome),
            area: areaNum,
            type: pastureType,
            status: pastureStatus,
            capacityUA: finalCapacityUA,
          });
          
          console.log(`✅ [PASTURE] Pastagem criada com sucesso:`, result);
          
          return {
            success: true,
            message: `Pastagem "${nome}" de ${areaNum} hectares registrada!`,
            data: result,
          };
        } catch (error) {
          console.error(`❌ [PASTURE] Erro ao criar pastagem:`, error);
          return {
            success: false,
            message: `Ops, deu um erro ao registrar a pastagem. Pode tentar de novo?`,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "registrar_manejo_pasto": {
        if (!entities.pasture_id || !entities.tipo_manejo) {
          return {
            success: false,
            message: "Preciso saber qual pastagem e o tipo de manejo.",
          };
        }

        const date = entities.date || entities.data || new Date().toISOString().split("T")[0];
        const description = entities.descricao || "Manejo registrado via assistente";
        const cost = entities.custo || 0;

        let result;
        const managementType = entities.tipo_manejo as ManagementType;

        if (managementType === ManagementType.FORMACAO) {
          result = pastureFinancialIntegration.registerFormation(
            entities.pasture_id,
            cost / 100,
            date,
            description,
            entities.tipo_pasto
          );
        } else if (managementType === ManagementType.REFORMA) {
          result = pastureFinancialIntegration.registerReform(
            entities.pasture_id,
            cost / 100,
            date,
            description
          );
        } else {
          result = pastureFinancialIntegration.registerMaintenance(
            entities.pasture_id,
            managementType,
            cost / 100,
            date,
            description
          );
        }

        return {
          success: true,
          message: `Manejo de pastagem registrado!`,
          data: result,
        };
      }

      // ========== CONSULTAS ==========
      case "consultar_financeiro": {
        // Se o usuário está perguntando sobre integração após venda/compra, confirmar que já foi feito
        // Isso será detectado pelo LLM no prompt, mas aqui garantimos uma resposta adequada
        return {
          success: true,
          message: "Os dados financeiros estão atualizados no dashboard. Quando você registra vendas ou compras de animais, as transações financeiras são criadas automaticamente.",
        };
      }
      
      case "consultar_pastagens":
      case "consultar_margens": {
        return {
          success: true,
          message: "Os dados estão no dashboard ao lado.",
        };
      }

      case "consultar_rebanho": {
        console.log(`📊 [LIVESTOCK] Consultando rebanho...`);
        
        // Se tem categoria e quantidade, pode ser um registro de animais existentes (inventário)
        if (entities.categoria && entities.quantidade) {
          let categoryId = "";
          try {
            const categoryEnum = parseLivestockCategory(entities.categoria);
            if (categoryEnum) {
              const category = categoryService.getByCategory(categoryEnum);
              categoryId = category?.id || "";
            }
          } catch (error) {
            console.error("❌ Erro ao processar categoria:", error);
          }

          if (!categoryId) {
            const categories = categoryService.getAll();
            categoryId = categories.find((c) => c.active)?.id || "";
          }

          if (!categoryId) {
            return {
              success: false,
              message: "Não consegui identificar a categoria. Pode ser mais específico?",
            };
          }

          const result = livestockFinancialIntegration.registerBirth(
            categoryId,
            entities.quantidade,
            entities.date || entities.data || new Date().toISOString().split("T")[0],
            entities.descricao || `Registro de ${entities.quantidade} animais existentes no sistema`
          );

          return {
            success: true,
            message: `${entities.quantidade} animais (${entities.categoria}) registrados!`,
            data: result,
          };
        }

        // Se pediu lista detalhada, retornar tabela
        const animals = animalService.getAll().filter(a => a.status === "ATIVO");
        const total = animals.length;
        
        if (total === 0) {
          return {
            success: true,
            message: "Nenhum animal registrado no rebanho.",
          };
        }

        // Agrupar por categoria
        const byCategory: Record<string, number> = {};
        animals.forEach(animal => {
          const categoryName = animal.categoryName || "Sem categoria";
          byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;
        });

        // Formatar tabela markdown
        let table = `\n**Rebanho: ${total} animais**\n\n`;
        table += "| Categoria | Quantidade |\n";
        table += "|-----------|-----------|\n";
        Object.entries(byCategory).forEach(([category, count]) => {
          table += `| ${category} | ${count} |\n`;
        });

        return {
          success: true,
          message: `${total} animais no total${table}`,
        };
      }

      case "consultar_rebanho_detalhado": {
        console.log(`📊 [LIVESTOCK] Consultando rebanho detalhado...`);
        const animals = animalService.getAll().filter(a => a.status === "ATIVO");
        
        if (animals.length === 0) {
          return {
            success: true,
            message: "Nenhum animal registrado no rebanho.",
          };
        }

        // Agrupar por categoria e calcular totais
        const byCategory: Record<string, { total: number; byGender: Record<string, number> }> = {};
        animals.forEach(animal => {
          const categoryName = animal.categoryName || "Sem categoria";
          const gender = animal.gender === "M" ? "Macho" : animal.gender === "F" ? "Fêmea" : "Indefinido";
          
          if (!byCategory[categoryName]) {
            byCategory[categoryName] = { total: 0, byGender: {} };
          }
          byCategory[categoryName].total++;
          byCategory[categoryName].byGender[gender] = (byCategory[categoryName].byGender[gender] || 0) + 1;
        });

        // Formatar tabela markdown
        let table = `\n**Rebanho Detalhado: ${animals.length} animais**\n\n`;
        table += "| Categoria | Total | Machos | Fêmeas |\n";
        table += "|-----------|------|--------|--------|\n";
        Object.entries(byCategory).forEach(([category, data]) => {
          const machos = data.byGender["Macho"] || 0;
          const femeas = data.byGender["Fêmea"] || 0;
          table += `| ${category} | ${data.total} | ${machos} | ${femeas} |\n`;
        });

        return {
          success: true,
          message: table,
        };
      }

      case "consultar_rebanho_por_sexo": {
        console.log(`📊 [LIVESTOCK] Consultando rebanho por sexo...`);
        const animals = animalService.getAll().filter(a => a.status === "ATIVO");
        
        if (animals.length === 0) {
          return {
            success: true,
            message: "Nenhum animal registrado no rebanho.",
          };
        }

        // Agrupar por sexo
        const byGender: Record<string, number> = {};
        animals.forEach(animal => {
          const gender = animal.gender === "M" ? "Macho" : animal.gender === "F" ? "Fêmea" : "Indefinido";
          byGender[gender] = (byGender[gender] || 0) + 1;
        });

        // Formatar tabela markdown
        let table = `\n**Rebanho por Sexo: ${animals.length} animais**\n\n`;
        table += "| Sexo | Quantidade |\n";
        table += "|------|------------|\n";
        Object.entries(byGender).forEach(([gender, count]) => {
          table += `| ${gender} | ${count} |\n`;
        });

        return {
          success: true,
          message: table,
        };
      }

      case "consultar_rebanho_por_categoria": {
        console.log(`📊 [LIVESTOCK] Consultando rebanho por categoria...`);
        const animals = animalService.getAll().filter(a => a.status === "ATIVO");
        
        if (animals.length === 0) {
          return {
            success: true,
            message: "Nenhum animal registrado no rebanho.",
          };
        }

        // Agrupar por categoria
        const byCategory: Record<string, number> = {};
        animals.forEach(animal => {
          const categoryName = animal.categoryName || "Sem categoria";
          byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;
        });

        // Formatar tabela markdown
        let table = `\n**Rebanho por Categoria: ${animals.length} animais**\n\n`;
        table += "| Categoria | Quantidade |\n";
        table += "|-----------|------------|\n";
        Object.entries(byCategory)
          .sort((a, b) => b[1] - a[1]) // Ordenar por quantidade (maior primeiro)
          .forEach(([category, count]) => {
            table += `| ${category} | ${count} |\n`;
          });

        return {
          success: true,
          message: table,
        };
      }

      // ========== SISTEMA ==========
      case "limpar_cache": {
        console.log(`🧹 [SYSTEM] Limpando cache...`);
        try {
          storage.clear();
          console.log(`✅ [SYSTEM] Cache limpo com sucesso`);
          return {
            success: true,
            message: "Cache limpo ✓",
          };
        } catch (error) {
          console.error(`❌ [SYSTEM] Erro ao limpar cache:`, error);
          return {
            success: false,
            message: "Erro ao limpar cache. Tente novamente.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "resetar_dados": {
        console.log(`🔄 [SYSTEM] Resetando todos os dados do sistema...`);
        try {
          storage.clear();
          console.log(`✅ [SYSTEM] Sistema resetado com sucesso`);
          return {
            success: true,
            message: "Sistema resetado ✓",
          };
        } catch (error) {
          console.error(`❌ [SYSTEM] Erro ao resetar sistema:`, error);
          return {
            success: false,
            message: "Erro ao resetar sistema. Tente novamente.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "resetar_rebanho": {
        console.log(`🔄 [SYSTEM] Resetando dados do rebanho...`);
        try {
          storage.remove(STORAGE_KEYS.LIVESTOCK_ANIMALS);
          storage.remove(STORAGE_KEYS.LIVESTOCK_EVENTS);
          storage.remove(STORAGE_KEYS.LIVESTOCK_MOVEMENTS);
          // Mantém categorias (são configurações padrão)
          console.log(`✅ [SYSTEM] Rebanho resetado com sucesso`);
          return {
            success: true,
            message: "Rebanho resetado ✓",
          };
        } catch (error) {
          console.error(`❌ [SYSTEM] Erro ao resetar rebanho:`, error);
          return {
            success: false,
            message: "Erro ao resetar rebanho. Tente novamente.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "resetar_financeiro": {
        console.log(`🔄 [SYSTEM] Resetando dados financeiros...`);
        try {
          storage.remove(STORAGE_KEYS.FINANCIAL_TRANSACTIONS);
          // Mantém contas (são configurações padrão)
          console.log(`✅ [SYSTEM] Financeiro resetado com sucesso`);
          return {
            success: true,
            message: "Financeiro resetado ✓",
          };
        } catch (error) {
          console.error(`❌ [SYSTEM] Erro ao resetar financeiro:`, error);
          return {
            success: false,
            message: "Erro ao resetar financeiro. Tente novamente.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "resetar_pastagens": {
        console.log(`🔄 [SYSTEM] Resetando dados de pastagens...`);
        try {
          storage.remove(STORAGE_KEYS.PASTURES);
          storage.remove(STORAGE_KEYS.PASTURE_MANAGEMENTS);
          console.log(`✅ [SYSTEM] Pastagens resetadas com sucesso`);
          return {
            success: true,
            message: "Pastagens resetadas ✓",
          };
        } catch (error) {
          console.error(`❌ [SYSTEM] Erro ao resetar pastagens:`, error);
          return {
            success: false,
            message: "Erro ao resetar pastagens. Tente novamente.",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          };
        }
      }

      case "solicitar_dados": {
        return {
          success: false,
          message: entities.mensagem || "Preciso de mais informações.",
        };
      }

      default: {
        return {
          success: false,
          message: "Não entendi. Pode reformular?",
        };
      }
    }
  } catch (error) {
    console.error("❌ Erro ao executar ação:", error);
    return {
      success: false,
      message: `Ops, deu um erro. Pode tentar de novo?`,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * ⚠️ PIPELINE ORIGINAL DESATIVADO
 * 
 * O pipeline tradicional (LLM → JSON → Executor) foi desativado em favor do
 * modelo LLM-centered (ai-orchestrator.ts).
 * 
 * A função executeAction() continua disponível para uso como tool pelo orchestrator.
 * 
 * Para usar o novo sistema, importe: import { aiOrchestrator } from "@/services/ai-orchestrator"
 */

// Pipeline original desativado - mantido apenas para referência
export const aiAgent = {
  /**
   * ⚠️ DESATIVADO: Use aiOrchestrator.processMessage() em vez disso
   * 
   * @deprecated Este método foi desativado. Use aiOrchestrator.processMessage() do módulo ai-orchestrator
   */
  processMessage: async (userMessage: string): Promise<{
    humanResponse?: string;
    tasks?: AIAgentResponse;
    results: AIAgentResult[];
  }> => {
    console.warn("⚠️ [DEPRECATED] aiAgent.processMessage() foi desativado. Use aiOrchestrator.processMessage() em vez disso.");
    
    // Redirecionar para orchestrator
    const { aiOrchestrator } = await import("./ai-orchestrator");
    const result = await aiOrchestrator.processMessage(userMessage);
    
    // Adaptar formato de retorno para compatibilidade
    return {
      humanResponse: result.finalResponse || result.message,
      results: result.success 
        ? [{ success: true, message: result.finalResponse || result.message }]
        : [{ success: false, message: result.message, error: result.errors?.join(", ") }],
    };
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return {
        results: [{
          success: false,
          message: "Configuração incompleta. Entre em contato com o suporte.",
        }],
      };
    }

    try {
      console.log("🔵 Interpretando mensagem:", userMessage);

      // 1. Interpretar com LLM
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AgrOmie ERP Rural",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-001",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na API OpenRouter:", response.status, errorText);
        return {
          results: [{
            success: false,
            message: "Desculpe, tive um problema. Pode tentar de novo?",
          }],
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return {
          results: [{
            success: false,
            message: "Não entendi. Pode reformular?",
          }],
        };
      }

      console.log("🔵 Resposta bruta da LLM:", content);

      // Extrair JSON da resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          results: [{
            success: false,
            message: "Não entendi. Pode reformular?",
          }],
        };
      }

      let parsed: AIAgentResponse;
      try {
        parsed = JSON.parse(jsonMatch[0]);
        
        // Normalizar data se necessário
        const normalizeDate = (entities: Record<string, any>) => {
          if (!entities.date && !entities.data) {
            entities.date = new Date().toISOString().split("T")[0];
          } else if (entities.data && !entities.date) {
            entities.date = entities.data;
          }
        };

        if (parsed.action?.entities) {
          normalizeDate(parsed.action.entities);
        }

        if (parsed.actions && Array.isArray(parsed.actions)) {
          parsed.actions.forEach((action: any) => {
            if (action.entities) {
              normalizeDate(action.entities);
            }
          });
        }

        console.log("✅ JSON parseado:", parsed);
      } catch (parseError) {
        console.error("❌ Erro ao fazer parse do JSON:", parseError);
        return {
          results: [{
            success: false,
            message: "Não entendi. Pode reformular?",
          }],
        };
      }

      // 2. Verificar se precisa solicitar mais dados
      if (parsed.action?.intent === "solicitar_dados") {
        return {
          humanResponse: parsed.response || parsed.action.entities?.mensagem || "Preciso de mais informações.",
          results: [{
            success: false,
            message: parsed.response || parsed.action.entities?.mensagem || "Preciso de mais informações.",
          }],
        };
      }

      // 3. Executar ações
      const results: AIAgentResult[] = [];

      console.log(`\n🔵 ========== EXECUTANDO AÇÕES ==========`);
      console.log(`📋 Parsed structure:`, JSON.stringify(parsed, null, 2));

      if (parsed.actions && Array.isArray(parsed.actions)) {
        // Múltiplas ações
        console.log(`📋 Múltiplas ações detectadas: ${parsed.actions.length}`);
        for (let i = 0; i < parsed.actions.length; i++) {
          const action = parsed.actions[i];
          console.log(`\n🔵 Executando ação ${i + 1}/${parsed.actions.length}:`, action.intent);
          const result = await executeAction(action.intent, action.entities || {});
          console.log(`✅ Resultado ação ${i + 1}:`, result);
          results.push(result);
        }
      } else if (parsed.action?.intent) {
        // Ação única
        console.log(`📋 Ação única detectada:`, parsed.action.intent);
        const result = await executeAction(parsed.action.intent, parsed.action.entities || {});
        console.log(`✅ Resultado ação:`, result);
        results.push(result);
      } else {
        console.error(`❌ Nenhuma ação encontrada no parsed!`);
        console.error(`Parsed completo:`, parsed);
        return {
          results: [{
            success: false,
            message: parsed.response || "Não entendi. Pode reformular?",
          }],
        };
      }

      console.log(`\n✅ ========== TODAS AS AÇÕES EXECUTADAS ==========`);
      console.log(`📊 Total de resultados: ${results.length}`);
      console.log(`✅ Sucessos: ${results.filter(r => r.success).length}`);
      console.log(`❌ Falhas: ${results.filter(r => !r.success).length}`);

      // 4. Gerar resposta humana baseada nos resultados
      let humanResponse = parsed.response;
      
      if (results.length > 0) {
        const allSuccess = results.every(r => r.success);
        if (allSuccess && results.length === 1) {
          // Se tudo deu certo e foi uma ação única, usar a mensagem do resultado
          humanResponse = results[0].message;
        } else if (allSuccess) {
          // Múltiplas ações bem-sucedidas
          humanResponse = parsed.response || `Pronto! ${results.length} ações registradas.`;
        } else {
          // Algumas falharam
          const successCount = results.filter(r => r.success).length;
          humanResponse = parsed.response || `Consegui registrar ${successCount} de ${results.length} ações.`;
        }
      }

      return {
        humanResponse,
        tasks: parsed,
        results,
      };
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
      return {
        results: [{
          success: false,
          message: "Desculpe, tive um problema. Pode tentar de novo?",
        }],
      };
    }
  },
};
