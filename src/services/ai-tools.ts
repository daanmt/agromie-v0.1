/**
 * Ferramentas (Tools) para o Agente LLM-Centered
 * Expõe funcionalidades do sistema para o LLM executar ações autônomas
 */

import { storage, STORAGE_KEYS } from "@/lib/storage";
import { executeAction } from "./ai-agent";

// Tipos para as tools
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
  };
}

/**
 * Leitura de arquivo do sistema
 */
export async function readFile(path: string): Promise<ToolResult> {
  try {
    // Em ambiente browser, não podemos ler arquivos diretamente
    // Mas podemos ler do storage ou retornar estrutura conhecida
    if (path.startsWith("storage:")) {
      const key = path.replace("storage:", "");
      const data = storage.get(key);
      return {
        success: true,
        data: data,
        message: `Dados de ${key} recuperados`,
      };
    }

    // Para arquivos de código, retornamos estrutura conhecida
    // Em produção, isso seria uma chamada ao backend
    return {
      success: false,
      error: "Leitura de arquivo não suportada no browser. Use storage: para acessar dados.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Escrita de arquivo (aplicação de patch)
 * Em ambiente browser, aplicamos mudanças via storage ou retornamos instruções
 */
export async function writeFile(path: string, patch: string): Promise<ToolResult> {
  try {
    // Em ambiente browser, não podemos escrever arquivos diretamente
    // Retornamos o patch para ser aplicado manualmente ou via backend
    return {
      success: true,
      data: { path, patch },
      message: "Patch gerado. Em ambiente browser, patches devem ser aplicados manualmente ou via backend.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Listar arquivos de um diretório
 */
export async function listFiles(directory: string): Promise<ToolResult> {
  try {
    // Em ambiente browser, retornamos estrutura conhecida
    const knownFiles = [
      "src/services/financial.ts",
      "src/services/livestock.ts",
      "src/services/pasture.ts",
      "src/services/ai-agent.ts",
      "src/pages/Dashboard.tsx",
      "src/pages/Financeiro.tsx",
      "src/pages/Pecuaria.tsx",
      "src/pages/Pastagens.tsx",
    ];

    const filtered = knownFiles.filter((f) => f.startsWith(directory));

    return {
      success: true,
      data: filtered,
      message: `${filtered.length} arquivos encontrados em ${directory}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Executar testes (mock - em produção seria real)
 */
export async function runTests(): Promise<ToolResult> {
  try {
    // Em ambiente browser, não podemos executar testes diretamente
    // Retornamos status simulado
    return {
      success: true,
      data: { passed: true, message: "Testes não disponíveis no browser" },
      message: "Testes não podem ser executados no ambiente browser",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Operações no dev server (mock)
 */
export async function runDevServerOp(command?: string): Promise<ToolResult> {
  try {
    return {
      success: true,
      data: { command, message: "Operações de dev server não disponíveis no browser" },
      message: "Operações de dev server não podem ser executadas no ambiente browser",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Consultar storage
 */
export async function queryStorage(key: string): Promise<ToolResult> {
  try {
    const data = storage.get(key);
    return {
      success: true,
      data: data,
      message: `Dados de ${key} recuperados`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Mutar storage
 */
export async function mutateStorage(key: string, payload: any): Promise<ToolResult> {
  try {
    storage.set(key, payload);
    return {
      success: true,
      data: payload,
      message: `Dados de ${key} atualizados`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Executar intent (integração com ai-agent.ts)
 */
export async function executeIntent(intent: string, entities: Record<string, any>): Promise<ToolResult> {
  try {
    const result = await executeAction(intent, entities);
    return {
      success: result.success,
      data: result.data,
      error: result.error,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Log de mensagens
 */
export async function log(message: string): Promise<ToolResult> {
  try {
    console.log(`[AI-TOOL] ${message}`);
    return {
      success: true,
      message: "Log registrado",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Definir todas as tools disponíveis
 */
export const TOOLS: ToolDefinition[] = [
  {
    name: "readFile",
    description: "Ler conteúdo de um arquivo do sistema. Use 'storage:KEY' para ler dados do storage.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Caminho do arquivo ou 'storage:KEY' para dados do storage",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "writeFile",
    description: "Aplicar um patch (unified diff) a um arquivo. Em ambiente browser, retorna o patch para aplicação manual.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Caminho do arquivo a modificar",
        },
        patch: {
          type: "string",
          description: "Patch no formato unified diff",
        },
      },
      required: ["path", "patch"],
    },
  },
  {
    name: "listFiles",
    description: "Listar arquivos de um diretório",
    parameters: {
      type: "object",
      properties: {
        directory: {
          type: "string",
          description: "Caminho do diretório",
        },
      },
      required: ["directory"],
    },
  },
  {
    name: "runTests",
    description: "Executar testes do sistema (não disponível no browser)",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "runDevServerOp",
    description: "Executar operação no dev server (não disponível no browser)",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "Comando opcional para o dev server",
        },
      },
      required: [],
    },
  },
  {
    name: "queryStorage",
    description: "Consultar dados do storage local (localStorage)",
    parameters: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "Chave do storage (ex: 'financial_transactions', 'livestock_animals')",
        },
      },
      required: ["key"],
    },
  },
  {
    name: "mutateStorage",
    description: "Atualizar dados do storage local",
    parameters: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "Chave do storage",
        },
        payload: {
          type: "object",
          description: "Dados a serem salvos",
        },
      },
      required: ["key", "payload"],
    },
  },
  {
    name: "executeIntent",
    description: "Executar uma ação do sistema AgrOmie. Esta é a ferramenta PRINCIPAL para todas as operações. Use para registrar compras, vendas, pastos, despesas, receitas, etc. Para operações complexas (múltiplas pastagens + animais), faça múltiplas chamadas em sequência ou use 'operacao_complexa_rebanho'. IMPORTANTE: Extraia TODAS as informações da mensagem antes de executar. Valores em centavos (R$ 150.000 = 15000000), datas em YYYY-MM-DD (30/11/25 = 2025-11-30), peso em kg (6@ = 90kg).",
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description: "Intent a executar. Use 'operacao_complexa_rebanho' para múltiplas pastagens + compra de animais, ou faça múltiplas chamadas (registrar_area_pasto + registrar_compra_animais).",
          enum: [
            "registrar_receita",
            "registrar_despesa",
            "registrar_investimento",
            "registrar_pró_labore",
            "registrar_compra_animais",
            "registrar_venda_animais",
            "registrar_nascimento",
            "registrar_morte",
            "registrar_pesagem",
            "registrar_inventario_rebanho",
            "registrar_movimentacao_rebanho",
            "registrar_area_pasto",
            "registrar_manejo_pasto",
            "operacao_complexa_rebanho",
            "consultar_financeiro",
            "consultar_rebanho",
            "consultar_rebanho_detalhado",
            "consultar_rebanho_por_sexo",
            "consultar_rebanho_por_categoria",
            "consultar_pastagens",
            "consultar_margens",
            "limpar_cache",
            "resetar_dados",
            "resetar_rebanho",
            "resetar_financeiro",
            "resetar_pastagens",
          ],
        },
        entities: {
          type: "object",
          description: "Entidades necessárias. Para registrar_compra_animais: {quantidade, categoria, valor (centavos), date, peso_medio (kg), descricao}. Para registrar_area_pasto: {nome, area (hectares), capacidadeUA, tipo, date}. Para operacao_complexa_rebanho: {pastos: [{nome, area}], total_animais, categoria, valor (centavos), peso_medio (kg), distribuicao: [qtd1, qtd2], date}.",
        },
      },
      required: ["intent", "entities"],
    },
  },
  {
    name: "log",
    description: "Registrar uma mensagem no log do sistema",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Mensagem a ser logada",
        },
      },
      required: ["message"],
    },
  },
];

/**
 * Executar uma tool por nome
 */
export async function executeTool(name: string, args: Record<string, any>): Promise<ToolResult> {
  switch (name) {
    case "readFile":
      return await readFile(args.path);
    case "writeFile":
      return await writeFile(args.path, args.patch);
    case "listFiles":
      return await listFiles(args.directory);
    case "runTests":
      return await runTests();
    case "runDevServerOp":
      return await runDevServerOp(args.command);
    case "queryStorage":
      return await queryStorage(args.key);
    case "mutateStorage":
      return await mutateStorage(args.key, args.payload);
    case "executeIntent":
      return await executeIntent(args.intent, args.entities);
    case "log":
      return await log(args.message);
    default:
      return {
        success: false,
        error: `Tool desconhecida: ${name}`,
      };
  }
}

