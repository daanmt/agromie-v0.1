import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnimals(propertyId?: string) {
  const queryClient = useQueryClient();

  const { data: animals = [], isLoading, error } = useQuery({
    queryKey: ['animals', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('animals')
        .select(`
          *,
          livestock_types(*)
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

  const createAnimal = useMutation({
    mutationFn: async (newAnimal: any) => {
      const { data, error } = await supabase
        .from('animals')
        .insert([newAnimal])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', propertyId] });
    },
  });

  const updateAnimal = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', propertyId] });
    },
  });

  const deleteAnimal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', propertyId] });
    },
  });

  const recordVaccination = useMutation({
    mutationFn: async (vaccination: any) => {
      const { data, error } = await supabase
        .from('animal_vaccinations')
        .insert([vaccination])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', propertyId] });
    },
  });

  return {
    animals,
    isLoading,
    error,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    recordVaccination,
  };
}
