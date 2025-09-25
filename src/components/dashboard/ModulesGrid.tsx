import { 
  Wheat, 
  Users, 
  CloudRain, 
  Package, 
  DollarSign, 
  QrCode, 
  Calendar, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stats: Array<{ label: string; value: string; trend?: string }>;
  route: string;
  status?: string;
  variant?: "default" | "success" | "warning" | "accent";
}

const modules: ModuleCardProps[] = [
  {
    title: "Gestão de Lavouras",
    description: "Controle de plantio, crescimento e produtividade das culturas",
    icon: Wheat,
    route: "/lavouras",
    variant: "success",
    status: "3 alertas",
    stats: [
      { label: "Área Total", value: "1.250 ha", trend: "+5%" },
      { label: "Culturas Ativas", value: "8", trend: "+2" },
      { label: "Produtividade Média", value: "85%" }
    ]
  },
  {
    title: "Gestão Pecuária", 
    description: "Controle de rebanho, vacinação e saúde animal",
    icon: Users,
    route: "/pecuaria",
    variant: "warning",
    status: "Vacinas pendentes",
    stats: [
      { label: "Total do Rebanho", value: "2.340", trend: "+45" },
      { label: "Vacinas em Dia", value: "92%" },
      { label: "Nascimentos/Mês", value: "28", trend: "+12%" }
    ]
  },
  {
    title: "Clima & Época de Seca",
    description: "Monitoramento climático e gestão de recursos hídricos",
    icon: CloudRain,
    route: "/clima", 
    variant: "accent",
    status: "Seca moderada",
    stats: [
      { label: "Precipitação/Mês", value: "45mm", trend: "-25%" },
      { label: "Reservatórios", value: "68%" },
      { label: "Previsão 7 dias", value: "Seco" }
    ]
  },
  {
    title: "Insumos & Estoque",
    description: "Controle de fertilizantes, sementes e produtos veterinários",
    icon: Package,
    route: "/insumos",
    stats: [
      { label: "Itens em Estoque", value: "156" },
      { label: "Valor Total", value: "R$ 89.5k" },
      { label: "Vencendo", value: "3 lotes", trend: "Atenção" }
    ]
  },
  {
    title: "Financeiro Rural",
    description: "Receitas, custos e fluxo de caixa por cultura e safra",
    icon: DollarSign,
    route: "/financeiro",
    variant: "success",
    stats: [
      { label: "Receita Safra", value: "R$ 2.1M", trend: "+18%" },
      { label: "Margem Líquida", value: "28.5%" },
      { label: "ROI Médio", value: "165%" }
    ]
  },
  {
    title: "Rastreabilidade",
    description: "QR Codes e histórico completo da produção",
    icon: QrCode,
    route: "/rastreabilidade",
    stats: [
      { label: "Lotes Rastreados", value: "842" },
      { label: "QR Codes Ativos", value: "1.205" },
      { label: "Certificações", value: "100%" }
    ]
  }
];

function ModuleCard({ title, description, icon: Icon, stats, route, status, variant = "default" }: ModuleCardProps) {
  const navigate = useNavigate();

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-success/30 bg-gradient-to-br from-success/5 to-background hover:shadow-success";
      case "warning":
        return "border-warning/30 bg-gradient-to-br from-warning/5 to-background hover:shadow-alert";
      case "accent":
        return "border-accent/40 bg-gradient-to-br from-accent/10 to-background hover:shadow-card";
      default:
        return "border-primary/20 bg-gradient-to-br from-primary/5 to-background hover:shadow-card";
    }
  };

  const getIconVariant = () => {
    switch (variant) {
      case "success":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "accent":
        return "bg-accent-primary text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card className={`border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${getVariantClasses()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${getIconVariant()}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
              {status && (
                <Badge 
                  variant={variant === "warning" ? "destructive" : variant === "success" ? "default" : "secondary"}
                  className="mt-1 text-xs"
                >
                  {status}
                </Badge>
              )}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{stat.value}</span>
                {stat.trend && (
                  <span className={`text-xs font-medium ${
                    stat.trend.includes('+') ? 'text-success' : 
                    stat.trend.includes('-') ? 'text-destructive' : 
                    'text-warning'
                  }`}>
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={() => navigate(route)}
          className="w-full bg-gradient-primary hover:shadow-success font-medium"
        >
          Acessar Módulo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function ModulesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {modules.map((module, index) => (
        <ModuleCard key={index} {...module} />
      ))}
    </div>
  );
}