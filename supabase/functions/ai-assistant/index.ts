import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    // System prompt focused on agricultural assistance and accessibility
    const systemPrompt = `Você é o assistente virtual do AgrOmie, um sistema de gestão agrícola focado em acessibilidade.

CONTEXTO DO SISTEMA:
- O AgrOmie ajuda agricultores a gerenciar lavouras, pecuária, clima, insumos, finanças e rastreabilidade
- Muitos usuários têm pouca experiência com tecnologia ou dificuldade de leitura
- Suas respostas devem ser SIMPLES, CLARAS e DIRETAS

DIRETRIZES DE RESPOSTA:
1. Use linguagem simples e cotidiana
2. Evite termos técnicos complexos
3. Seja empático e paciente
4. Forneça instruções passo a passo quando necessário
5. Use analogias do campo quando possível
6. Mantenha respostas curtas (máximo 3-4 frases)

FUNCIONALIDADES DO SISTEMA:
- Dashboard: Visão geral de tudo
- Lavouras: Controlar plantações, safras e produção
- Pecuária: Cuidar do gado, vacinas e nascimentos
- Clima: Ver previsão do tempo e alertas
- Insumos: Controlar sementes, ração e medicamentos
- Financeiro: Ver gastos e ganhos
- Rastreabilidade: Rastrear produtos

Ajude o usuário a entender e usar o sistema de forma simples.`;

    // Build messages array with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    console.log("Calling Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error("Error in ai-assistant function:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: "Desculpe, estou com dificuldades no momento. Tente novamente em alguns instantes."
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
