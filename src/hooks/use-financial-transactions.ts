import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFinancialTransactions(propertyId?: string) {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['financial_transactions', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          transaction_categories(*)
        `)
        .order('transaction_date', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId,
  });

  const { data: summary } = useQuery({
    queryKey: ['financial_summary', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      const { data: revenues } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('property_id', propertyId)
        .eq('type', 'receita');

      const { data: expenses } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('property_id', propertyId)
        .eq('type', 'despesa');

      const totalRevenue = revenues?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        marginPercentage: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0,
      };
    },
    enabled: !!propertyId,
  });

  const createTransaction = useMutation({
    mutationFn: async (newTransaction: any) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary', propertyId] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary', propertyId] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_transactions', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['financial_summary', propertyId] });
    },
  });

  return {
    transactions,
    summary,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
