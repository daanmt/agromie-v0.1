import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, User, DollarSign, Beef, TrendingUp, Activity, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { aiOrchestrator } from "@/services/ai-orchestrator";
import { financialCalculations, accountService } from "@/services/financial";
import { livestockCalculations, categoryService } from "@/services/livestock";
import { pastureCalculations, pastureService } from "@/services/pasture";

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

export default function Dashboard() {
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
  
  // Estado para controlar quais cards estão expandidos
  const [expandedCards, setExpandedCards] = useState({
    financial: true,
    livestock: true,
    pasture: true,
  });

  // Carregar métricas do dashboard
  const [metrics, setMetrics] = useState({
    financial: {
      receitaBruta: 0,
      lucroLiquido: 0,
      margemLiquida: 0,
      despesasTotais: 0,
      margemBruta: 0,
      margemOperacional: 0,
      lucroBruto: 0,
      lucroOperacional: 0,
      investimentos: 0,
      retiradas: 0,
    },
    livestock: {
      totalAnimals: 0,
      totalValue: 0,
      birthRate: 0,
      mortalityRate: 0,
      turnoverRate: 0,
      averageGMD: 0,
    },
    pasture: {
      totalArea: 0,
      stockingRate: 0,
      totalCapacityUA: 0,
      currentUA: 0,
      totalPastures: 0,
      status: "IDEAL" as "IDEAL" | "SUBLOTADO" | "SUPERLOTADO",
      pastures: [] as Array<{
        pastureId: string;
        pastureName: string;
        area: number;
        capacityUA: number;
        totalCapacity: number;
        currentUA: number;
        stockingRate: number;
        status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
        animals: number;
      }>,
    },
  });

  // Carregar métricas do dashboard
  const loadMetrics = useCallback(() => {
    try {
      // Log reduzido
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      
      let financialMetrics = { 
        receitaBruta: 0, 
        lucroLiquido: 0, 
        margemLiquida: 0, 
        custosTotais: 0,
        margemBruta: 0,
        margemOperacional: 0,
        lucroBruto: 0,
        lucroOperacional: 0,
        investimentos: 0,
        retiradas: 0
      };
      let livestockMetrics = { 
        totalAnimals: 0, 
        totalValue: 0, 
        birthRate: 0, 
        mortalityRate: 0,
        turnoverRate: 0,
        averageGMD: 0
      };
      let pastureBalance: {
        totalArea: number;
        stockingRate: number;
        totalCapacityUA: number;
        currentUA: number;
        status?: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
        pastures?: Array<{
          pastureId: string;
          pastureName: string;
          area: number;
          capacityUA: number;
          totalCapacity: number;
          currentUA: number;
          stockingRate: number;
          status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
          animals: number;
        }>;
      } = { 
        totalArea: 0, 
        stockingRate: 0,
        totalCapacityUA: 0,
        currentUA: 0,
        status: "IDEAL",
        pastures: []
      };

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
        const allPastures = pastureService.getAll();
        console.log("🌾 Total de pastagens registradas:", allPastures.length);
      } catch (error) {
        console.error("Erro ao calcular balanço de pastagens:", error);
      }

      setMetrics({
        financial: {
          receitaBruta: financialMetrics.receitaBruta || 0,
          lucroLiquido: financialMetrics.lucroLiquido || 0,
          margemLiquida: financialMetrics.margemLiquida || 0,
          despesasTotais: financialMetrics.custosTotais || 0,
          margemBruta: financialMetrics.margemBruta || 0,
          margemOperacional: financialMetrics.margemOperacional || 0,
          lucroBruto: financialMetrics.lucroBruto || 0,
          lucroOperacional: financialMetrics.lucroOperacional || 0,
          investimentos: financialMetrics.investimentos || 0,
          retiradas: financialMetrics.retiradas || 0,
        },
        livestock: {
          totalAnimals: livestockMetrics.totalAnimals || 0,
          totalValue: livestockMetrics.totalValue || 0,
          birthRate: livestockMetrics.birthRate || 0,
          mortalityRate: livestockMetrics.mortalityRate || 0,
          turnoverRate: livestockMetrics.turnoverRate || 0,
          averageGMD: livestockMetrics.averageGMD || 0,
        },
        pasture: {
          totalArea: pastureBalance?.totalArea || 0,
          stockingRate: pastureBalance?.stockingRate || 0,
          totalCapacityUA: pastureBalance?.totalCapacityUA || 0,
          currentUA: pastureBalance?.currentUA || 0,
          totalPastures: pastureService.getAll().length || 0,
          status: (pastureBalance?.status || "IDEAL") as "IDEAL" | "SUBLOTADO" | "SUPERLOTADO",
          pastures: (pastureBalance?.pastures || []) as Array<{
            pastureId: string;
            pastureName: string;
            area: number;
            capacityUA: number;
            totalCapacity: number;
            currentUA: number;
            stockingRate: number;
            status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO";
            animals: number;
          }>,
        },
      });
      console.log("✅ Métricas atualizadas no estado");
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        accountService.initializeDefault();
        categoryService.initializeDefault();
        loadMetrics();
      } catch (error) {
        console.error("Erro ao inicializar serviços:", error);
      }
    };
    initialize();
  }, [loadMetrics]);

  // Recarregar métricas quando a janela recebe foco
  useEffect(() => {
    const handleFocus = () => {
      // Log removido - muito verboso
      loadMetrics();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadMetrics]);

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

      // Recarregar métricas se houve tool calls (ações executadas)
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
          description: `${result.toolCalls} ação(ões) executada(s) em ${result.iterations} iteração(ões)`,
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
          
          <div className="flex-1 flex gap-6 p-6">
            {/* KPIs Principais - Layout Lean */}
            <div className="w-80 space-y-3 shrink-0">
              {/* Financeiro */}
              <Card className="border border-border">
                <Collapsible
                  open={expandedCards.financial}
                  onOpenChange={(open) => setExpandedCards(prev => ({ ...prev, financial: open }))}
                >
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger className="w-full cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-1 -m-1">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Financeiro
                        </div>
                        {expandedCards.financial ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Receita Bruta</span>
                        <span className="font-semibold text-sm">{formatCurrency(metrics.financial.receitaBruta)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Lucro Líquido</span>
                        <span className={`font-semibold text-sm ${metrics.financial.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(metrics.financial.lucroLiquido)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Margem Líquida</span>
                        <span className="font-semibold text-sm">{metrics.financial.margemLiquida.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-muted-foreground text-xs">Investimentos</span>
                        <span className="font-semibold text-sm text-orange-600">{formatCurrency(metrics.financial.investimentos)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Despesas Totais</span>
                        <span className="font-semibold text-sm text-red-600">{formatCurrency(metrics.financial.despesasTotais)}</span>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Rebanho */}
              <Card className="border border-border">
                <Collapsible
                  open={expandedCards.livestock}
                  onOpenChange={(open) => setExpandedCards(prev => ({ ...prev, livestock: open }))}
                >
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger className="w-full cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-1 -m-1">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Beef className="h-4 w-4" />
                          Rebanho
                        </div>
                        {expandedCards.livestock ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Total de Animais</span>
                        <span className="font-semibold text-sm">{metrics.livestock.totalAnimals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Valor Patrimonial</span>
                        <span className="font-semibold text-sm text-green-600">{formatCurrency(metrics.livestock.totalValue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Taxa de Nascimento</span>
                        <span className="font-semibold text-sm">{metrics.livestock.birthRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-muted-foreground text-xs">Taxa de Mortalidade</span>
                        <span className="font-semibold text-sm">{metrics.livestock.mortalityRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Taxa de Desfrute</span>
                        <span className="font-semibold text-sm">{metrics.livestock.turnoverRate.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Pastagens */}
              <Card className="border border-border">
                <Collapsible
                  open={expandedCards.pasture}
                  onOpenChange={(open) => setExpandedCards(prev => ({ ...prev, pasture: open }))}
                >
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger className="w-full cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-1 -m-1">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Pastagens
                        </div>
                        {expandedCards.pasture ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Total de Pastos</span>
                        <span className="font-semibold text-sm">{metrics.pasture.totalPastures}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Área Total</span>
                        <span className="font-semibold text-sm">{metrics.pasture.totalArea.toFixed(1)} ha</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Taxa de Lotação</span>
                        <span className="font-semibold text-sm">{metrics.pasture.stockingRate.toFixed(2)} UA/ha</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Capacidade Total</span>
                        <span className="font-semibold text-sm">{metrics.pasture.totalCapacityUA.toFixed(1)} UA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">UA Atual</span>
                        <span className="font-semibold text-sm">{metrics.pasture.currentUA.toFixed(1)} UA</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-muted-foreground text-xs">Status</span>
                        <span className={`font-semibold text-xs px-2 py-0.5 rounded ${
                          metrics.pasture.status === "IDEAL" ? "bg-green-100 text-green-700" :
                          metrics.pasture.status === "SUBLOTADO" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {metrics.pasture.status}
                        </span>
                      </div>
                      
                      {/* Lista de Pastos */}
                      {metrics.pasture.pastures && metrics.pasture.pastures.length > 0 && (
                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">Pastos Registrados:</div>
                          {metrics.pasture.pastures.map((pasto) => (
                            <div key={pasto.pastureId} className="bg-muted/50 rounded p-2 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="font-semibold text-xs">{pasto.pastureName}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Área:</span>
                                  <span className="font-medium">{pasto.area.toFixed(1)} ha</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Capacidade:</span>
                                  <span className="font-medium">{pasto.capacityUA.toFixed(2)} UA/ha</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">UA Atual:</span>
                                  <span className="font-medium">{pasto.currentUA.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Lotação:</span>
                                  <span className={`font-medium ${
                                    pasto.status === "IDEAL" ? "text-green-600" :
                                    pasto.status === "SUBLOTADO" ? "text-yellow-600" :
                                    "text-red-600"
                                  }`}>
                                    {pasto.stockingRate.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>

            {/* Chat Principal */}
            <div className="flex-1 flex flex-col min-w-0">
              <Card className="flex-1 flex flex-col border-2 border-border">
                {/* Header */}
                <div className="p-4 border-b border-border shrink-0">
                  <div className="flex items-center gap-3">
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
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role !== "user" && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
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

