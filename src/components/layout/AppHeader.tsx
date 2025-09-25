import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  return (
    <header className="h-16 bg-card border-b-2 border-border shadow-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9" />
        
        <div className="relative w-80 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar propriedades, culturas, animais..." 
            className="pl-10 bg-background border-2 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-warning text-warning-foreground text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h3 className="font-semibold">Alertas Importantes</h3>
            </div>
            <DropdownMenuItem className="p-3 border-b">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-warning">Época de Seca Próxima</span>
                <span className="text-sm text-muted-foreground">Propriedade São José - Previsão para próxima semana</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 border-b">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-destructive">Vacinas Vencendo</span>
                <span className="text-sm text-muted-foreground">15 animais precisam de vacinação em 3 dias</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-success">Safra Pronta</span>
                <span className="text-sm text-muted-foreground">Milho - Fazenda Central pronto para colheita</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-muted-foreground">Fazendeiro</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}