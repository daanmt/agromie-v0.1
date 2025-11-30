import { Search, User, Volume2, VolumeX, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSpeech } from "@/hooks/use-speech";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const { isEnabled, toggle, speak } = useSpeech();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Até logo!',
        description: 'Você foi desconectado com sucesso.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const userEmail = user?.email || 'Usuário';
  const userName = user?.full_name || user?.email || 'Usuário';
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
        {/* Audio Accessibility Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isEnabled ? "default" : "outline"} 
                size="icon"
                onClick={() => {
                  toggle();
                  speak(isEnabled ? "Áudio desativado" : "Áudio de acessibilidade ativado. Passe o mouse sobre os elementos para ouvir as informações");
                }}
                className="relative"
                aria-label={isEnabled ? "Desativar áudio de acessibilidade" : "Ativar áudio de acessibilidade"}
              >
                {isEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">
                {isEnabled ? "Desativar" : "Ativar"} áudio de acessibilidade
              </p>
              <p className="text-xs text-muted-foreground">
                Ouça informações ao passar o mouse
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}