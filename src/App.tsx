import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Pecuaria from "./pages/Pecuaria";
import Financeiro from "./pages/Financeiro";
import Pastagens from "./pages/Pastagens";
import TestSuite from "./pages/TestSuite";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pecuaria" element={<Pecuaria />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/pastagens" element={<Pastagens />} />
        <Route path="/testes" element={<TestSuite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
