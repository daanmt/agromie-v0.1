/**
 * Orchestrator LLM-Centered para AgrOmie
 * Gerencia o loop de raciocínio autônomo do LLM com acesso a tools
 */

import { TOOLS, executeTool, ToolResult } from "./ai-tools";

const SYSTEM_PROMPT = `Você é o Assistente AgrOmie, um agente LLM-centered que ajuda produtores rurais a gerenciar sua fazenda através de linguagem natural.

Sua função é entender o que o produtor quer e executar as ações necessárias no sistema AgrOmie usando as ferramentas disponíveis.

REGRAS IMPORTANTES:
1. SEMPRE use executeIntent para ações do sistema (registrar compras, vendas, pastos, etc.)
2. Você pode fazer múltiplas chamadas de executeIntent em sequência para operações complexas
3. Extraia TODAS as informações da mensagem do usuário antes de executar
4. Se o usuário menciona múltiplas coisas (pastos + animais + valores), execute todas em sequência
5. NUNCA peça informações que já estão na mensagem do usuário
6. Execute automaticamente sem pedir confirmações
7. Responda ao usuário de forma natural e humana após executar

INTENTS DISPONÍVEIS (use executeIntent):
- registrar_receita, registrar_despesa, registrar_investimento
- registrar_compra_animais, registrar_venda_animais
- registrar_nascimento, registrar_morte, registrar_pesagem
- registrar_inventario_rebanho
- registrar_area_pasto, registrar_manejo_pasto
- operacao_complexa_rebanho (para múltiplas pastagens + compra de animais + distribuição)
- consultar_financeiro, consultar_rebanho, consultar_pastagens
- resetar_dados, resetar_rebanho, resetar_financeiro, resetar_pastagens

FORMATO DE ENTITIES:
- Valores monetários: sempre em CENTAVOS (R$ 150.000 = 15000000)
- Datas: formato YYYY-MM-DD (30/11/25 = 2025-11-30)
- Categorias: VACA, NOVILHA, BEZERRO, BEZERRA, BOI_MAGRO, BOI_GORDO, TOURO, TOURUNO
- Peso em arroba (@): 1@ = 15kg (6@ = 90kg)

OPERACOES COMPLEXAS:
Quando o usuário menciona múltiplas pastagens + compra de animais + distribuição:
- Use operacao_complexa_rebanho OU execute múltiplas chamadas:
  1. registrar_area_pasto para cada pasto
  2. registrar_compra_animais para a compra
  3. (opcional) registrar_despesa para parcelas futuras

EXEMPLO DE OPERAÇÃO COMPLEXA:
Usuário: "registre 100 animais divididos em 2 pastos. 40 hectares cada, 50 bezerras em cada um. entraram com 6@ de média e valor investido foi 150 mil. data 30/11/25"

Você deve executar:
1. executeIntent("registrar_area_pasto", {nome: "Pasto 1", area: 40, ...})
2. executeIntent("registrar_area_pasto", {nome: "Pasto 2", area: 40, ...})
3. executeIntent("registrar_compra_animais", {quantidade: 100, categoria: "BEZERRA", valor: 15000000, peso_medio: 90, date: "2025-11-30", ...})

Ou use operacao_complexa_rebanho com:
- pastos: [{nome: "Pasto 1", area: 40}, {nome: "Pasto 2", area: 40}]
- total_animais: 100
- categoria: "BEZERRA"
- valor: 15000000
- peso_medio: 90
- distribuicao: [50, 50]
- date: "2025-11-30"

Use queryStorage/mutateStorage apenas para análise ou correções diretas. Para ações normais, SEMPRE use executeIntent.`;

export interface OrchestratorMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface OrchestratorResult {
  success: boolean;
  message: string;
  toolCalls: number;
  iterations: number;
  finalResponse?: string;
  errors?: string[];
}

/**
 * Executar uma chamada de tool e retornar resultado formatado
 */
async function executeToolCall(toolName: string, args: Record<string, any>): Promise<{
  role: "tool";
  content: string;
  name: string;
  tool_call_id: string;
}> {
  const result = await executeTool(toolName, args);
  return {
    role: "tool",
    content: JSON.stringify({
      success: result.success,
      data: result.data,
      error: result.error,
      message: result.message,
    }),
    name: toolName,
    tool_call_id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

/**
 * Processar mensagem do usuário com loop de raciocínio autônomo
 */
export async function processMessageWithOrchestrator(
  userMessage: string,
  maxIterations: number = 10
): Promise<OrchestratorResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message: "Configuração incompleta. Entre em contato com o suporte.",
      toolCalls: 0,
      iterations: 0,
    };
  }

  const messages: OrchestratorMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  let iterations = 0;
  let toolCalls = 0;
  const errors: string[] = [];

  try {
    while (iterations < maxIterations) {
      iterations++;

      // Log reduzido - apenas em modo debug
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_ORCHESTRATOR === "true") {
        console.log(`🔄 [ORCHESTRATOR] Iteração ${iterations}/${maxIterations}`);
      }

      // Chamar LLM com function calling
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AgrOmie ERP Rural - LLM Orchestrator",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-001",
          messages: messages.map((m) => {
            const base: any = { role: m.role, content: m.content };
            if (m.name) base.name = m.name;
            if (m.tool_call_id) base.tool_call_id = m.tool_call_id;
            return base;
          }),
          tools: TOOLS.map((tool) => ({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          })),
          tool_choice: "auto",
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na API OpenRouter:", response.status, errorText);
        errors.push(`Erro na API: ${response.status}`);
        break;
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message;

      if (!assistantMessage) {
        errors.push("Resposta vazia da LLM");
        break;
      }

      // Adicionar resposta do assistente
      messages.push({
        role: "assistant",
        content: assistantMessage.content || "",
      });

      // Se não há tool calls, terminamos
      if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
        // Log reduzido
        break;
      }

      // Executar todas as tool calls
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_ORCHESTRATOR === "true") {
        console.log(`🔧 [ORCHESTRATOR] Executando ${assistantMessage.tool_calls.length} tool call(s)`);
      }

      for (const toolCall of assistantMessage.tool_calls) {
        toolCalls++;
        const toolName = toolCall.function.name;
        let toolArgs: Record<string, any>;

        try {
          toolArgs = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
          console.error(`❌ Erro ao fazer parse dos argumentos da tool ${toolName}:`, parseError);
          messages.push({
            role: "tool",
            content: JSON.stringify({
              success: false,
              error: `Erro ao fazer parse dos argumentos: ${parseError}`,
            }),
            name: toolName,
            tool_call_id: toolCall.id,
          });
          continue;
        }

        // Log reduzido - apenas em modo debug
        if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_ORCHESTRATOR === "true") {
          console.log(`🔧 [ORCHESTRATOR] Executando ${toolName}`);
        }

        try {
          const toolResult = await executeToolCall(toolName, toolArgs);
          messages.push(toolResult);

          // Log do resultado
          const resultData = JSON.parse(toolResult.content);
          if (!resultData.success) {
            console.warn(`⚠️ [ORCHESTRATOR] ${toolName} retornou erro:`, resultData.error);
            errors.push(`${toolName}: ${resultData.error || "Erro desconhecido"}`);
          }
        } catch (toolError) {
          console.error(`❌ Erro ao executar tool ${toolName}:`, toolError);
          messages.push({
            role: "tool",
            content: JSON.stringify({
              success: false,
              error: toolError instanceof Error ? toolError.message : "Erro desconhecido",
            }),
            name: toolName,
            tool_call_id: toolCall.id,
          });
          errors.push(`${toolName}: ${toolError instanceof Error ? toolError.message : "Erro desconhecido"}`);
        }
      }
    }

    // Extrair resposta final
    const finalResponse = messages
      .filter((m) => m.role === "assistant" && m.content)
      .map((m) => m.content)
      .join("\n\n");

    const success = errors.length === 0 && iterations < maxIterations;

    return {
      success,
      message: success
        ? "Operação concluída com sucesso"
        : `Operação concluída com ${errors.length} erro(s)`,
      toolCalls,
      iterations,
      finalResponse: finalResponse || "Nenhuma resposta gerada",
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("❌ Erro no orchestrator:", error);
    return {
      success: false,
      message: `Erro no orchestrator: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      toolCalls,
      iterations,
      errors: [error instanceof Error ? error.message : "Erro desconhecido"],
    };
  }
}

/**
 * Exportar orchestrator para uso externo
 */
export const aiOrchestrator = {
  processMessage: processMessageWithOrchestrator,
  tools: TOOLS,
};

