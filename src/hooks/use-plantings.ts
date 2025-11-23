import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlantings(propertyId?: string) {
  const queryClient = useQueryClient();

  const { data: plantings = [], isLoading, error } = useQuery({
    queryKey: ['plantings', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('plantings')
        .select(`
          *,
          crops(*)
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

  const createPlanting = useMutation({
    mutationFn: async (newPlanting: any) => {
      const { data, error } = await supabase
        .from('plantings')
        .insert([newPlanting])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantings', propertyId] });
    },
  });

  const updatePlanting = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('plantings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantings', propertyId] });
    },
  });

  const deletePlanting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plantings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantings', propertyId] });
    },
  });

  return {
    plantings,
    isLoading,
    error,
    createPlanting,
    updatePlanting,
    deletePlanting,
  };
}
