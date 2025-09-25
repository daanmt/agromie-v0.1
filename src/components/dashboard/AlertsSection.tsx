import { AlertTriangle, Droplets, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "warning" | "critical" | "info" | "success";
  title: string;
  description: string;
  time: string;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Época de Seca Crítica",
    description: "Propriedade São José - Reservatórios em 15%. Ação imediata necessária.",
    time: "2h atrás",
    action: "Ver Plano de Irrigação"
  },
  {
    id: "2", 
    type: "warning",
    title: "Vacinas Vencendo",
    description: "25 bovinos na Fazenda Central precisam de vacinação em 48h.",
    time: "4h atrás",
    action: "Agendar Vacinação"
  },
  {
    id: "3",
    type: "info",
    title: "Safra Próxima ao Ponto",
    description: "Milho na propriedade Norte estará pronto para colheita em 1 semana.",
    time: "6h atrás",
    action: "Programar Colheita"
  },
  {
    id: "4",
    type: "success",
    title: "Meta de Produção Atingida",
    description: "Soja superou expectativa em 12% na fazenda Sul.",
    time: "1 dia atrás"
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case "warning":
      return <Calendar className="h-5 w-5 text-warning" />;
    case "info":
      return <Droplets className="h-5 w-5 text-accent-primary" />;
    case "success":
      return <TrendingUp className="h-5 w-5 text-success" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const getAlertBadgeVariant = (type: string) => {
  switch (type) {
    case "critical":
      return "destructive";
    case "warning":
      return "secondary";
    case "info":
      return "outline";
    case "success":
      return "default";
    default:
      return "outline";
  }
};

export function AlertsSection() {
  return (
    <Card className="border-2 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertas Importantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-background to-muted/30 border border-border hover:shadow-sm transition-all duration-200"
            >
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                  <Badge variant={getAlertBadgeVariant(alert.type) as any} className="text-xs">
                    {alert.type === "critical" ? "Crítico" : 
                     alert.type === "warning" ? "Atenção" :
                     alert.type === "info" ? "Info" : "Sucesso"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  {alert.action && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs hover:bg-primary hover:text-primary-foreground"
                    >
                      {alert.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}