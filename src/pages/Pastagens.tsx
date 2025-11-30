import { useState, useEffect } from "react";
import { Activity, MapPin, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  pastureService,
  pastureCalculations,
  managementService,
} from "@/services/pasture";
import { Pasture, PastureStatus, PastureType } from "@/types/pasture";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Pastagens = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pastures, setPastures] = useState<Pasture[]>([]);
  const [balance, setBalance] = useState({
    totalArea: 0,
    totalCapacityUA: 0,
    currentUA: 0,
    stockingRate: 0,
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
  });

  useEffect(() => {
    loadData();
  }, []);

  // Recarregar dados quando a página recebe foco
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadData = () => {
    try {
      const allPastures = pastureService.getAll();
      setPastures(allPastures);

      const pastureBalance = pastureCalculations.calculateBalance();
      setBalance({
        totalArea: pastureBalance.totalArea || 0,
        totalCapacityUA: pastureBalance.totalCapacityUA || 0,
        currentUA: pastureBalance.currentUA || 0,
        stockingRate: pastureBalance.stockingRate || 0,
        status: pastureBalance.status || "IDEAL",
        pastures: pastureBalance.pastures || [],
      });
    } catch (error) {
      console.error("Erro ao carregar dados de pastagens:", error);
    }
  };

  const handleDelete = (id: string) => {
    const pasture = pastureService.getById(id);
    if (!pasture) return;

    if (confirm(`Tem certeza que deseja excluir a pastagem "${pasture.name}"?`)) {
      try {
        pastureService.delete(id);
        toast({
          title: "✅ Pastagem excluída",
          description: `A pastagem "${pasture.name}" foi excluída com sucesso.`,
        });
        loadData();
      } catch (error) {
        toast({
          title: "❌ Erro",
          description: "Não foi possível excluir a pastagem.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO") => {
    switch (status) {
      case "IDEAL":
        return "bg-green-100 text-green-700 border-green-300";
      case "SUBLOTADO":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "SUPERLOTADO":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: PastureStatus) => {
    const labels: Record<PastureStatus, string> = {
      [PastureStatus.EM_FORMACAO]: "Em Formação",
      [PastureStatus.PRODUZINDO]: "Produzindo",
      [PastureStatus.EM_DESCANSO]: "Em Descanso",
      [PastureStatus.DEGRADADA]: "Degradada",
      [PastureStatus.EM_REFORMA]: "Em Reforma",
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: PastureType) => {
    const labels: Record<PastureType, string> = {
      [PastureType.BRAQUIARIA]: "Braquiária",
      [PastureType.PANICUM]: "Panicum",
      [PastureType.CAPIM_ELEFANTE]: "Capim Elefante",
      [PastureType.TIFTON]: "Tifton",
      [PastureType.NATIVA]: "Nativa",
      [PastureType.OUTRA]: "Outra",
    };
    return labels[type] || type;
  };

  const getPastureStocking = (pastureId: string) => {
    return balance.pastures.find(p => p.pastureId === pastureId);
  };

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
                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Gestão de Pastagens</h1>
                  <p className="text-muted-foreground">Controle de áreas, capacidade e lotação de pastagens</p>
                </div>
              </div>
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Pastagem via IA
              </Button>
            </div>

            {/* Métricas Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{balance.totalArea.toFixed(1)} ha</h3>
                  <p className="text-sm text-muted-foreground">Área Total</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{balance.totalCapacityUA.toFixed(1)} UA</h3>
                  <p className="text-sm text-muted-foreground">Capacidade Total</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-foreground">{balance.currentUA.toFixed(1)} UA</h3>
                  <p className="text-sm text-muted-foreground">UA Atual</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className={getStatusColor(balance.status)}>
                      {balance.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-2xl text-foreground">{balance.stockingRate.toFixed(2)} UA/ha</h3>
                  <p className="text-sm text-muted-foreground">Taxa de Lotação</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Pastagens */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Pastagens Registradas ({pastures.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastures.length > 0 ? (
                  pastures.map((pasture) => {
                    const stocking = getPastureStocking(pasture.id);
                    const totalCapacity = pasture.area * pasture.capacityUA;
                    const stockingRatePercent = totalCapacity > 0 
                      ? ((stocking?.currentUA || 0) / totalCapacity) * 100 
                      : 0;
                    
                    let stockingStatus: "IDEAL" | "SUBLOTADO" | "SUPERLOTADO" = "IDEAL";
                    if (stockingRatePercent < 80) {
                      stockingStatus = "SUBLOTADO";
                    } else if (stockingRatePercent > 120) {
                      stockingStatus = "SUPERLOTADO";
                    }

                    return (
                      <Card key={pasture.id} className="border-2 transition-all duration-300 hover:scale-[1.02]">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-foreground">
                              {pasture.name}
                            </CardTitle>
                            <Badge variant="outline" className={getStatusColor(stockingStatus)}>
                              {stockingStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Área:</span>
                              <p className="font-semibold text-foreground text-lg">
                                {pasture.area.toFixed(1)} ha
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Capacidade:</span>
                              <p className="font-semibold text-foreground">
                                {pasture.capacityUA.toFixed(2)} UA/ha
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tipo:</span>
                              <p className="font-semibold text-foreground">
                                {getTypeLabel(pasture.type)}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <p className="font-semibold text-foreground">
                                {getStatusLabel(pasture.status)}
                              </p>
                            </div>
                            {stocking && (
                              <>
                                <div>
                                  <span className="text-muted-foreground">UA Atual:</span>
                                  <p className="font-semibold text-foreground">
                                    {stocking.currentUA.toFixed(1)} UA
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Lotação:</span>
                                  <p className={`font-semibold ${
                                    stockingStatus === "IDEAL" ? "text-green-600" :
                                    stockingStatus === "SUBLOTADO" ? "text-yellow-600" :
                                    "text-red-600"
                                  }`}>
                                    {stockingRatePercent.toFixed(1)}%
                                  </p>
                                </div>
                              </>
                            )}
                            {pasture.formationDate && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Formada em:</span>
                                <p className="font-semibold text-foreground">
                                  {format(new Date(pasture.formationDate), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {pasture.notes && (
                            <div className="pt-2 border-t border-border">
                              <p className="text-sm text-muted-foreground">{pasture.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button 
                              className="flex-1 bg-primary text-primary-foreground"
                              onClick={() => navigate("/dashboard")}
                            >
                              Registrar Manejo
                            </Button>
                            <Button 
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(pasture.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="col-span-full border-2 border-dashed">
                    <CardContent className="p-12 text-center">
                      <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Nenhuma pastagem registrada
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Comece registrando pastagens através do Assistente IA.
                      </p>
                      <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground">
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

export default Pastagens;

