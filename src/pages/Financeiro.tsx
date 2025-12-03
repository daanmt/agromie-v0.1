import { useState, useEffect } from "react";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, PieChart, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TransactionForm } from "@/components/financial/TransactionForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  transactionService,
  accountService,
  financialCalculations,
} from "@/services/financial";
import { TransactionType, type FinancialTransaction } from "@/types/financial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100); // Converter de centavos para reais
};

const Financeiro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | undefined>();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [metrics, setMetrics] = useState({
    receitaBruta: 0,
    custosTotais: 0,
    lucroLiquido: 0,
    margemBruta: 0,
    margemOperacional: 0,
    margemLiquida: 0,
    despesasOperacionais: 0,
    investimentos: 0,
    retiradas: 0,
    custoOperacionalFazenda: 0,
  });
  const [cashFlow, setCashFlow] = useState<Array<{
    month: string;
    monthName: string;
    entradas: number;
    saidas: number;
    saldo: number;
  }>>([]);

  // Inicializar plano de contas padrão
  useEffect(() => {
    try {
      accountService.initializeDefault();
      loadData();
    } catch (error) {
      console.error("Erro ao inicializar serviços financeiros:", error);
    }
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
      const allTransactions = transactionService.getAll();
      setTransactions(allTransactions);

      // Calcular métricas do ano atual
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      const newMetrics = financialCalculations.calculateMetrics(startDate, endDate);
      setMetrics(newMetrics);

      // Atualizar fluxo de caixa
      setCashFlow(financialCalculations.getCashFlow(12));
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
      transactionService.delete(id);
      toast({
        title: "Lançamento excluído",
        description: "O lançamento foi removido com sucesso.",
      });
      loadData();
    }
  };

  const handleEdit = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setEditingTransaction(undefined);
    loadData();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  // Agrupar transações por tipo para exibição
  const transactionsByType = {
    [TransactionType.RECEITA]: transactions.filter((t) => t.type === TransactionType.RECEITA),
    [TransactionType.DESPESA]: transactions.filter((t) => t.type === TransactionType.DESPESA),
    [TransactionType.INVESTIMENTO]: transactions.filter((t) => t.type === TransactionType.INVESTIMENTO),
    [TransactionType.RETIRADA]: transactions.filter((t) => t.type === TransactionType.RETIRADA),
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <main className="flex-1 p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Financeiro Rural</h1>
                <p className="text-muted-foreground">Gestão financeira completa da fazenda</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>

        {/* Métricas Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="border-2 border-border bg-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">
                {formatCurrency(metrics.receitaBruta)}
              </h3>
              <p className="text-sm text-muted-foreground">Receita Bruta</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-border bg-card">
            <CardContent className="p-6 text-center">
              <TrendingDown className="h-8 w-8 text-warning mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">
                {formatCurrency(metrics.custosTotais)}
              </h3>
              <p className="text-sm text-muted-foreground">Custos Totais</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-border bg-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">
                {formatCurrency(metrics.lucroLiquido)}
              </h3>
              <p className="text-sm text-muted-foreground">Lucro Líquido</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-border bg-card">
            <CardContent className="p-6 text-center">
              <PieChart className="h-8 w-8 text-accent-primary mx-auto mb-2" />
              <h3 className="font-bold text-2xl text-foreground">
                {metrics.margemLiquida.toFixed(1)}%
              </h3>
              <p className="text-sm text-muted-foreground">Margem Líquida</p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Margens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margem Bruta:</span>
                <span className="font-semibold">{metrics.margemBruta.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margem Operacional:</span>
                <span className="font-semibold">{metrics.margemOperacional.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margem Líquida:</span>
                <span className="font-semibold">{metrics.margemLiquida.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Despesas Operacionais:</span>
                <span className="font-semibold">{formatCurrency(metrics.despesasOperacionais)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investimentos:</span>
                <span className="font-semibold">{formatCurrency(metrics.investimentos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retiradas:</span>
                <span className="font-semibold">{formatCurrency(metrics.retiradas)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custo Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(metrics.custoOperacionalFazenda)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Despesas + Investimentos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fluxo de Caixa */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Fluxo de Caixa - Últimos 12 Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-right">Entradas</TableHead>
                    <TableHead className="text-right">Saídas</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlow.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhum lançamento registrado ainda
                      </TableCell>
                    </TableRow>
                  ) : (
                    cashFlow.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell className="font-medium">{item.monthName}</TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          {formatCurrency(item.entradas)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-destructive">
                          {formatCurrency(item.saidas)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${
                            item.saldo >= 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {formatCurrency(item.saldo)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Lançamentos Recentes */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Lançamentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum lançamento registrado. Clique em "Novo Lançamento" para começar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 20)
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === TransactionType.RECEITA
                                  ? "default"
                                  : transaction.type === TransactionType.DESPESA
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {transaction.accountName || "N/A"}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              transaction.type === TransactionType.RECEITA
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {transaction.type === TransactionType.RECEITA ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

            {/* Formulário de Lançamento */}
            <TransactionForm
              open={isFormOpen}
              onOpenChange={handleFormClose}
              transaction={editingTransaction}
              onSuccess={handleFormSuccess}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Financeiro;
