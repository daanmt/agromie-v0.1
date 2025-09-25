import { Wheat, Users, TrendingUp, MapPin, Droplets, DollarSign } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { ModulesGrid } from "@/components/dashboard/ModulesGrid";
import farmHero from "@/assets/farm-hero.jpg";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-dashboard">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Welcome Section */}
            <div 
              className="relative rounded-2xl p-8 text-primary-foreground shadow-success overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 50%, hsl(var(--primary-dark)) 100%), url(${farmHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Bem-vindo ao AgroERP</h1>
                  <p className="text-primary-foreground/90 text-lg">
                    Gerencie suas operações agrícolas com inteligência e eficiência
                  </p>
                  <p className="text-primary-foreground/70 mt-2">
                    Dashboard atualizado • Última sincronização há 5 minutos
                  </p>
                </div>
                <div className="hidden md:block">
                  <Wheat className="h-24 w-24 text-primary-foreground/20" />
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Propriedades Ativas"
                value="12"
                subtitle="3.450 hectares total"
                icon={MapPin}
                trend={{ value: "+2", isPositive: true }}
                variant="success"
              />
              <MetricsCard
                title="Rebanho Total"
                value="2.340"
                subtitle="Bovinos + Suínos"
                icon={Users}
                trend={{ value: "+45", isPositive: true }}
                variant="accent"
              />
              <MetricsCard
                title="Produtividade"
                value="89.5%"
                subtitle="Meta da safra atual"
                icon={TrendingUp}
                trend={{ value: "+12%", isPositive: true }}
                variant="default"
              />
              <MetricsCard
                title="Reservatórios"
                value="68%"
                subtitle="Capacidade média"
                icon={Droplets}
                trend={{ value: "-15%", isPositive: false }}
                variant="warning"
              />
            </div>

            {/* Alerts and Modules Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Alerts Section */}
              <div className="xl:col-span-1">
                <AlertsSection />
              </div>
              
              {/* Quick Actions */}
              <div className="xl:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Visão Geral dos Módulos</h2>
                  <p className="text-muted-foreground">Acesse rapidamente os principais recursos do sistema</p>
                </div>
                <ModulesGrid />
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-card rounded-xl p-6 border-2 border-border shadow-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Resumo de Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-success" />
                  </div>
                  <h4 className="font-semibold text-foreground">Receita Bruta</h4>
                  <p className="text-2xl font-bold text-success">R$ 2.1M</p>
                  <p className="text-sm text-muted-foreground">Esta safra</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Crescimento</h4>
                  <p className="text-2xl font-bold text-primary">+18.5%</p>
                  <p className="text-sm text-muted-foreground">vs. safra anterior</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wheat className="h-8 w-8 text-accent-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Eficiência</h4>
                  <p className="text-2xl font-bold text-accent-primary">94.2%</p>
                  <p className="text-sm text-muted-foreground">Aproveitamento da terra</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
