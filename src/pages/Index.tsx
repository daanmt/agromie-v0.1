import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { aiOrchestrator } from "@/services/ai-orchestrator";
import { financialCalculations, accountService } from "@/services/financial";
import { livestockCalculations, categoryService } from "@/services/livestock";
import { pastureCalculations } from "@/services/pasture";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o assistente do AgrOmie. Posso ajudá-lo a registrar receitas, despesas, compras e vendas de animais, nascimentos, formação de pastagens e muito mais. Como posso ajudá-lo?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar métricas do dashboard
  const [metrics, setMetrics] = useState({
    financial: {
      receitaBruta: 0,
      lucroLiquido: 0,
      margemLiquida: 0,
    },
    livestock: {
      totalAnimals: 0,
      totalValue: 0,
    },
    pasture: {
      totalArea: 0,
      stockingRate: 0,
    },
  });

  useEffect(() => {
    try {
      accountService.initializeDefault();
      categoryService.initializeDefault();
      loadMetrics();
    } catch (error) {
      console.error("Erro ao inicializar serviços:", error);
    }
  }, []);

  const loadMetrics = () => {
    try {
      // Log removido - muito verboso
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      
      let financialMetrics = { receitaBruta: 0, lucroLiquido: 0, margemLiquida: 0 };
      let livestockMetrics = { totalAnimals: 0, totalValue: 0 };
      let pastureBalance = { totalArea: 0, stockingRate: 0 };

      try {
        financialMetrics = financialCalculations.calculateMetrics(startDate, endDate);
        console.log("💰 Métricas financeiras:", financialMetrics);
      } catch (error) {
        console.error("Erro ao calcular métricas financeiras:", error);
      }

      try {
        livestockMetrics = livestockCalculations.calculateMetrics(startDate, endDate);
        console.log("🐄 Métricas do rebanho:", livestockMetrics);
      } catch (error) {
        console.error("Erro ao calcular métricas do rebanho:", error);
      }

      try {
        pastureBalance = pastureCalculations.calculateBalance();
        console.log("🌾 Balanço de pastagens:", pastureBalance);
      } catch (error) {
        console.error("Erro ao calcular balanço de pastagens:", error);
      }

      setMetrics({
        financial: {
          receitaBruta: financialMetrics.receitaBruta || 0,
          lucroLiquido: financialMetrics.lucroLiquido || 0,
          margemLiquida: financialMetrics.margemLiquida || 0,
        },
        livestock: {
          totalAnimals: livestockMetrics.totalAnimals || 0,
          totalValue: livestockMetrics.totalValue || 0,
        },
        pasture: {
          totalArea: pastureBalance.totalArea || 0,
          stockingRate: pastureBalance.stockingRate || 0,
        },
      });
      console.log("✅ Métricas atualizadas no estado");
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Processar mensagem com orchestrator LLM-centered
      const result = await aiOrchestrator.processMessage(userInput);

      // Mostrar resposta do orchestrator
      const assistantMessage: Message = {
        role: "assistant",
        content: result.finalResponse || result.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Recarregar métricas se houve tool calls
      if (result.toolCalls > 0) {
        setTimeout(() => {
          loadMetrics();
        }, 300);
        setTimeout(() => {
          loadMetrics();
        }, 1000);
      }
      
      if (result.success) {
        toast({
          title: "✅ Concluído",
          description: `${result.toolCalls} ação(ões) executada(s)`,
        });
      } else {
        toast({
          title: "⚠️ Atenção",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: `Desculpe, tive um problema. Pode tentar de novo?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Erro",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <div className="flex-1 flex gap-8 p-8">
            {/* Dashboard Lateral */}
            <div className="w-80 space-y-4 shrink-0">
              <Card className="p-6 border-2 border-border">
                <h3 className="font-bold text-lg mb-6">Dashboard</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">FINANCEIRO</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Receita Bruta:</span>
                        <span className="font-semibold">{formatCurrency(metrics.financial.receitaBruta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lucro Líquido:</span>
                        <span className="font-semibold">{formatCurrency(metrics.financial.lucroLiquido)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem Líquida:</span>
                        <span className="font-semibold">{metrics.financial.margemLiquida.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">REBANHO</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total de Animais:</span>
                        <span className="font-semibold">{metrics.livestock.totalAnimals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor Patrimonial:</span>
                        <span className="font-semibold">{formatCurrency(metrics.livestock.totalValue)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">PASTAGENS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Área Total:</span>
                        <span className="font-semibold">{metrics.pasture.totalArea.toFixed(1)} ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Lotação:</span>
                        <span className="font-semibold">{metrics.pasture.stockingRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Principal */}
            <div className="flex-1 flex flex-col min-w-0">
              <Card className="flex-1 flex flex-col border-2 border-border">
                {/* Header */}
                <div className="p-6 border-b border-border shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Assistente AgrOmie</h2>
                      <p className="text-sm text-muted-foreground">Sempre aqui para ajudar você</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-4 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role !== "user" && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border shrink-0">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className="bg-primary text-primary-foreground"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
