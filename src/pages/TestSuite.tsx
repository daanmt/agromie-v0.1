/**
 * Página de Testes End-to-End
 * Executa suite completa de testes e exibe resultados
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Loader2, Play } from "lucide-react";
import { runE2ETests } from "@/tests/e2e-test-suite";

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export default function TestSuite() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResult[];
  } | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runE2ETests();
      setResults(testResults);
    } catch (error) {
      console.error("Erro ao executar testes:", error);
      setResults({
        total: 0,
        passed: 0,
        failed: 1,
        results: [{
          name: "Erro",
          success: false,
          message: error instanceof Error ? error.message : "Erro desconhecido",
        }],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testes End-to-End</h1>
          <p className="text-muted-foreground mt-2">
            Suite completa de testes simulando operações reais do sistema
          </p>
        </div>
        <Button
          onClick={handleRunTests}
          disabled={isRunning}
          size="lg"
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Executar Testes
            </>
          )}
        </Button>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultados dos Testes
              <span className={`text-sm font-normal ${results.failed > 0 ? "text-destructive" : "text-green-600"}`}>
                ({results.passed}/{results.total} passou)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{result.name}</h3>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.errors && result.errors.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                            {result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        )}
                        {result.data && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground">
                              Ver detalhes
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Testes Incluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✅ Teste 1: Registro de Pastagens</li>
            <li>✅ Teste 2: Compra de Animais com Integração Financeira</li>
            <li>✅ Teste 3: Cálculo de UA e Taxa de Lotação</li>
            <li>✅ Teste 4: Venda de Animais com Integração Financeira</li>
            <li>✅ Teste 5: Cálculo de Métricas Financeiras</li>
            <li>✅ Teste 6: Registro de Despesa</li>
            <li>✅ Teste 7: Registro de Manejo de Pastagem</li>
            <li>✅ Teste 8: Cálculo de Métricas do Rebanho</li>
            <li>✅ Teste 9: Verificação de UA Após Venda</li>
            <li>✅ Teste 10: Validação de Integridade de Dados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

