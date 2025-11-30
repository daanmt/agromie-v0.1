import { useState, useEffect } from "react";
import { ArrowLeft, Beef, Activity, Calendar, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  categoryService,
  livestockCalculations,
} from "@/services/livestock";
import { LivestockCategory } from "@/types/livestock";
const formatCurrencyValue = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

const Pecuaria = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(categoryService.getAll());
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    totalValue: 0,
    birthRate: 0,
    mortalityRate: 0,
  });

  useEffect(() => {
    try {
      // Inicializar categorias
      categoryService.initializeDefault();
      setCategories(categoryService.getAll());
      loadMetrics();
    } catch (error) {
      console.error("Erro ao inicializar serviços de pecuária:", error);
    }
  }, []);

  // Recarregar métricas quando a página recebe foco
  useEffect(() => {
    const handleFocus = () => {
      loadMetrics();
      setCategories(categoryService.getAll());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadMetrics = () => {
    try {
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      
      const livestockMetrics = livestockCalculations.calculateMetrics(startDate, endDate);
      setMetrics({
        totalAnimals: livestockMetrics.totalAnimals || 0,
        totalValue: livestockMetrics.totalValue || 0,
        birthRate: livestockMetrics.birthRate || 0,
        mortalityRate: livestockMetrics.mortalityRate || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
    }
  };

  const stock = (() => {
    try {
      return livestockCalculations.calculateStockByCategory();
    } catch (error) {
      console.error("Erro ao calcular estoque:", error);
      return [];
    }
  })();
  const activeCategories = categories.filter((c) => c.active);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <Beef className="h-6 w-6 text-warning-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Gestão Pecuária</h1>
                  <p className="text-muted-foreground">Controle de rebanho, eventos e indicadores zootécnicos</p>
                </div>
              </div>
              <Button onClick={() => navigate("/ai-chat")} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Evento via IA
              </Button>
            </div>

            {/* Métricas Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <Beef className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{metrics.totalAnimals}</h3>
                  <p className="text-sm text-muted-foreground">Total do Rebanho</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{formatCurrencyValue(metrics.totalValue)}</h3>
                  <p className="text-sm text-muted-foreground">Valor Patrimonial</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{metrics.birthRate.toFixed(1)}%</h3>
                  <p className="text-sm text-muted-foreground">Taxa de Nascimento</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{metrics.mortalityRate.toFixed(1)}%</h3>
                  <p className="text-sm text-muted-foreground">Taxa de Mortalidade</p>
                </CardContent>
              </Card>
            </div>

            {/* Estoque por Categoria */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Estoque por Categoria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stock.length > 0 ? (
                  stock.map((categoryStock) => {
                    const category = activeCategories.find((c) => c.category === categoryStock.category);
                    if (!category) return null;
                    
                    return (
                      <Card key={categoryStock.category} className="border-2 transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-foreground">
                              {category.name}
                            </CardTitle>
                            <Badge variant="default">
                              {category.code}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Quantidade:</span>
                              <p className="font-semibold text-foreground text-lg">{categoryStock.quantity}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Valor Total:</span>
                              <p className="font-semibold text-foreground">
                                {formatCurrencyValue(categoryStock.totalValue)}
                              </p>
                            </div>
                            {categoryStock.averageWeight && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Peso Médio:</span>
                                <p className="font-semibold text-foreground">
                                  {categoryStock.averageWeight.toFixed(1)} kg
                                </p>
                              </div>
                            )}
                          </div>
                          <Button 
                            className="w-full bg-primary text-primary-foreground"
                            onClick={() => navigate("/ai-chat")}
                          >
                            Registrar Evento
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="col-span-full border-2 border-dashed">
                    <CardContent className="p-12 text-center">
                      <Beef className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Nenhum animal registrado
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Comece registrando compras ou nascimentos de animais através do Assistente IA.
                      </p>
                      <Button onClick={() => navigate("/ai-chat")} className="bg-primary text-primary-foreground">
                        Ir para Assistente IA
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Pecuaria;
