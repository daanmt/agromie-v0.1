import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSupplies(propertyId?: string) {
  const queryClient = useQueryClient();

  const { data: supplies = [], isLoading, error } = useQuery({
    queryKey: ['supplies', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('supplies')
        .select(`
          *,
          supplies_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['supplies_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplies_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  const createSupply = useMutation({
    mutationFn: async (newSupply: any) => {
      const { data, error } = await supabase
        .from('supplies')
        .insert([newSupply])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies', propertyId] });
    },
  });

  const updateSupply = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('supplies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies', propertyId] });
    },
  });

  const deleteSupply = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supplies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies', propertyId] });
    },
  });

  return {
    supplies,
    categories,
    isLoading,
    error,
    createSupply,
    updateSupply,
    deleteSupply,
  };
}
