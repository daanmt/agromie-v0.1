-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  size_hectares DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- Create crops table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crops"
  ON public.crops FOR SELECT
  USING (true);

-- Create plantings table
CREATE TABLE public.plantings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  crop_id UUID NOT NULL REFERENCES public.crops(id),
  area_hectares DECIMAL(10,2),
  planting_date DATE,
  expected_harvest_date DATE,
  status TEXT DEFAULT 'planted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plantings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view plantings of own properties"
  ON public.plantings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = plantings.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create plantings for own properties"
  ON public.plantings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = plantings.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update plantings of own properties"
  ON public.plantings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = plantings.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete plantings of own properties"
  ON public.plantings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = plantings.property_id
    AND properties.user_id = auth.uid()
  ));

-- Create livestock_types table
CREATE TABLE public.livestock_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.livestock_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view livestock types"
  ON public.livestock_types FOR SELECT
  USING (true);

-- Create animals table
CREATE TABLE public.animals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  livestock_type_id UUID NOT NULL REFERENCES public.livestock_types(id),
  tag_number TEXT,
  birth_date DATE,
  weight_kg DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view animals of own properties"
  ON public.animals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = animals.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create animals for own properties"
  ON public.animals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = animals.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update animals of own properties"
  ON public.animals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = animals.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete animals of own properties"
  ON public.animals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = animals.property_id
    AND properties.user_id = auth.uid()
  ));

-- Create animal_vaccinations table
CREATE TABLE public.animal_vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  vaccination_date DATE NOT NULL,
  next_vaccination_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.animal_vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vaccinations of own animals"
  ON public.animal_vaccinations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.animals
    JOIN public.properties ON properties.id = animals.property_id
    WHERE animals.id = animal_vaccinations.animal_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create vaccinations for own animals"
  ON public.animal_vaccinations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.animals
    JOIN public.properties ON properties.id = animals.property_id
    WHERE animals.id = animal_vaccinations.animal_id
    AND properties.user_id = auth.uid()
  ));

-- Create supplies_categories table
CREATE TABLE public.supplies_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.supplies_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view supply categories"
  ON public.supplies_categories FOR SELECT
  USING (true);

-- Create supplies table
CREATE TABLE public.supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.supplies_categories(id),
  name TEXT NOT NULL,
  quantity DECIMAL(10,2),
  unit TEXT,
  min_quantity DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view supplies of own properties"
  ON public.supplies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = supplies.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create supplies for own properties"
  ON public.supplies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = supplies.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update supplies of own properties"
  ON public.supplies FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = supplies.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete supplies of own properties"
  ON public.supplies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = supplies.property_id
    AND properties.user_id = auth.uid()
  ));

-- Create transaction_categories table
CREATE TABLE public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transaction categories"
  ON public.transaction_categories FOR SELECT
  USING (true);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.transaction_categories(id),
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transactions of own properties"
  ON public.financial_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = financial_transactions.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create transactions for own properties"
  ON public.financial_transactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = financial_transactions.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update transactions of own properties"
  ON public.financial_transactions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = financial_transactions.property_id
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete transactions of own properties"
  ON public.financial_transactions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = financial_transactions.property_id
    AND properties.user_id = auth.uid()
  ));

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plantings_updated_at
  BEFORE UPDATE ON public.plantings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON public.animals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplies_updated_at
  BEFORE UPDATE ON public.supplies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();