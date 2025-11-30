import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";
import { transactionService, accountService } from "@/services/financial";
import { TransactionType, AccountGroup, type FinancialTransaction } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  accountId: z.string().min(1, "Selecione uma conta"),
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Valor deve ser um número positivo"
  ),
  category: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: FinancialTransaction;
  onSuccess?: () => void;
}

export function TransactionForm({ open, onOpenChange, transaction, onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    transaction ? new Date(transaction.date) : new Date()
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || TransactionType.RECEITA,
      accountId: transaction?.accountId || "",
      date: transaction?.date || new Date().toISOString().split("T")[0],
      description: transaction?.description || "",
      amount: transaction ? (transaction.amount / 100).toFixed(2) : "",
      category: transaction?.category || "",
      notes: transaction?.notes || "",
    },
  });

  const transactionType = form.watch("type");

  // Buscar contas baseado no tipo de transação
  const getAccountsForType = () => {
    switch (transactionType) {
      case TransactionType.RECEITA:
        return accountService.getByGroup(AccountGroup.RECEITAS);
      case TransactionType.DESPESA:
        return accountService.getByGroup(AccountGroup.DESPESAS);
      case TransactionType.INVESTIMENTO:
        return accountService.getByGroup(AccountGroup.INVESTIMENTOS);
      case TransactionType.RETIRADA:
        return accountService.getByGroup(AccountGroup.PRO_LABORE);
      default:
        return [];
    }
  };

  const accounts = getAccountsForType();

  useEffect(() => {
    if (date) {
      form.setValue("date", format(date, "yyyy-MM-dd"));
    }
  }, [date, form]);

  const onSubmit = (values: TransactionFormValues) => {
    try {
      const amountInCents = Math.round(parseFloat(values.amount) * 100);

      if (transaction) {
        transactionService.update(transaction.id, {
          type: values.type,
          accountId: values.accountId,
          date: values.date,
          description: values.description,
          amount: amountInCents,
          category: values.category,
          notes: values.notes,
        });
        toast({
          title: "Lançamento atualizado",
          description: "O lançamento foi atualizado com sucesso.",
        });
      } else {
        transactionService.create({
          type: values.type,
          accountId: values.accountId,
          date: values.date,
          description: values.description,
          amount: amountInCents,
          category: values.category,
          notes: values.notes,
        });
        toast({
          title: "Lançamento criado",
          description: "O lançamento foi registrado com sucesso.",
        });
      }

      form.reset();
      setDate(new Date());
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o lançamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Lançamento" : "Novo Lançamento Financeiro"}
          </DialogTitle>
          <DialogDescription>
            Registre receitas, despesas, investimentos ou retiradas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Lançamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransactionType.RECEITA}>Receita</SelectItem>
                      <SelectItem value={TransactionType.DESPESA}>Despesa</SelectItem>
                      <SelectItem value={TransactionType.INVESTIMENTO}>Investimento</SelectItem>
                      <SelectItem value={TransactionType.RETIRADA}>Retirada (Pró-labore)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione a conta do plano de contas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? (
                              format(date, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Venda de 10 cabeças de gado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Venda de Gado, Compra de Ração" {...field} />
                  </FormControl>
                  <FormDescription>
                    Categoria adicional para organização
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {transaction ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

