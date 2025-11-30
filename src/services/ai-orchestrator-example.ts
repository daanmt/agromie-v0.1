/**
 * Exemplo de uso do Orchestrator LLM-Centered
 * 
 * Este arquivo demonstra como integrar o orchestrator em componentes existentes.
 * Você pode usar este código como referência para migrar gradualmente.
 */

import { aiOrchestrator } from "./ai-orchestrator";

/**
 * Exemplo 1: Uso básico do orchestrator
 */
export async function exemploBasico() {
  const result = await aiOrchestrator.processMessage(
    "Vendi 50 bezerras por R$ 119.000"
  );

  if (result.success) {
    console.log("✅ Sucesso:", result.message);
    console.log("📊 Tool calls:", result.toolCalls);
    console.log("🔄 Iterações:", result.iterations);
    console.log("💬 Resposta:", result.finalResponse);
  } else {
    console.error("❌ Erro:", result.message);
    if (result.errors) {
      console.error("Erros:", result.errors);
    }
  }
}

/**
 * Exemplo 2: Integração com componente React
 */
export async function exemploReactIntegration(
  userInput: string,
  setMessages: (fn: (prev: any[]) => any[]) => void,
  setIsLoading: (loading: boolean) => void,
  toast: (options: any) => void
) {
  setIsLoading(true);

  try {
    const result = await aiOrchestrator.processMessage(userInput);

    if (result.success) {
      // Adicionar mensagem do assistente
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.finalResponse || result.message,
          timestamp: new Date(),
        },
      ]);

      // Mostrar toast de sucesso
      toast({
        title: "✅ Concluído",
        description: `${result.toolCalls} ação(ões) executada(s)`,
      });

      // Recarregar métricas se necessário
      if (result.toolCalls > 0) {
        // Disparar evento para recarregar dashboard
        window.dispatchEvent(new Event("metrics-update"));
      }
    } else {
      // Mostrar erro
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Erro: ${result.message}`,
          timestamp: new Date(),
        },
      ]);

      toast({
        title: "❌ Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    toast({
      title: "Erro",
      description: "Tente novamente.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}

/**
 * Exemplo 3: Uso com limite de iterações customizado
 */
export async function exemploComLimite() {
  const result = await aiOrchestrator.processMessage(
    "Analise todos os dados financeiros e me dê um resumo",
    20 // maxIterations
  );

  console.log(`Executado em ${result.iterations} iterações`);
}

/**
 * Exemplo 4: Modo híbrido (tradicional + orchestrator)
 * 
 * Use o modo tradicional para ações simples e o orchestrator para ações complexas
 */
export async function exemploModoHibrido(userInput: string) {
  // Detectar se é ação complexa (requer múltiplas tools)
  const acoesComplexas = [
    "corrigir",
    "otimizar",
    "analisar",
    "validar",
    "verificar",
    "debug",
  ];

  const isComplexa = acoesComplexas.some((palavra) =>
    userInput.toLowerCase().includes(palavra)
  );

  if (isComplexa) {
    // Usar orchestrator para ações complexas
    console.log("🔧 Usando orchestrator (modo LLM-centered)");
    return await aiOrchestrator.processMessage(userInput);
  } else {
    // Usar modo tradicional para ações simples
    console.log("⚡ Usando modo tradicional");
    const { aiAgent } = await import("./ai-agent");
    return await aiAgent.processMessage(userInput);
  }
}

