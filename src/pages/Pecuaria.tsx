import { ArrowLeft, Beef, Activity, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Pecuaria = () => {
  const navigate = useNavigate();

  const rebanhos = [
    {
      id: 1,
      tipo: "Bovinos de Corte",
      quantidade: 1840,
      status: "success",
      vacinasEmDia: 95,
      proximaVacina: "15/01/2025",
      categoria: "Adultos"
    },
    {
      id: 2,
      tipo: "Suínos",
      quantidade: 500,
      status: "warning",
      vacinasEmDia: 88,
      proximaVacina: "08/01/2025",
      categoria: "Reprodução"
    },
    {
      id: 3,
      tipo: "Bovinos Leiteiros",
      quantidade: 120,
      status: "success",
      vacinasEmDia: 100,
      proximaVacina: "22/01/2025",
      categoria: "Lactação"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
              <Beef className="h-6 w-6 text-warning-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão Pecuária</h1>
              <p className="text-muted-foreground">Controle de rebanho, vacinação e saúde animal</p>
            </div>
          </div>
        </div>

        {/* Métricas Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-background">
            <CardContent className="p-6 text-center">
              <Beef className="h-8 w-8 text-warning mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">2.460</h3>
              <p className="text-sm text-muted-foreground">Total do Rebanho</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-success/30 bg-gradient-to-br from-success/5 to-background">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">94%</h3>
              <p className="text-sm text-muted-foreground">Vacinas em Dia</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">+28</h3>
              <p className="text-sm text-muted-foreground">Nascimentos/Mês</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-background">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-accent-primary mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">5</h3>
              <p className="text-sm text-muted-foreground">Vacinas Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Rebanhos */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Controle por Rebanho</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rebanhos.map((rebanho) => (
              <Card key={rebanho.id} className="border-2 transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-foreground">{rebanho.tipo}</CardTitle>
                    <Badge variant={rebanho.status === "success" ? "default" : "secondary"}>
                      {rebanho.categoria}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <p className="font-semibold text-foreground">{rebanho.quantidade}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vacinas:</span>
                      <p className="font-semibold text-foreground">{rebanho.vacinasEmDia}%</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Próxima Vacina:</span>
                      <p className="font-semibold text-foreground">{rebanho.proximaVacina}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-primary">
                    Gerenciar Rebanho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pecuaria;