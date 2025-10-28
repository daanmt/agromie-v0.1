import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeechProvider } from "@/hooks/use-speech";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lavouras from "./pages/Lavouras";
import Pecuaria from "./pages/Pecuaria";
import Clima from "./pages/Clima";
import Insumos from "./pages/Insumos";
import Financeiro from "./pages/Financeiro";
import Rastreabilidade from "./pages/Rastreabilidade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SpeechProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lavouras" element={<Lavouras />} />
            <Route path="/pecuaria" element={<Pecuaria />} />
            <Route path="/clima" element={<Clima />} />
            <Route path="/insumos" element={<Insumos />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/rastreabilidade" element={<Rastreabilidade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SpeechProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
