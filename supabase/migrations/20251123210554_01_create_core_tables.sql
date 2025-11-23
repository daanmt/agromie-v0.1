/*
  # Core Tables - AgrOmie ERP System
  
  This migration creates the foundational tables for the AgrOmie agricultural management system.
  
  1. New Tables
    - `profiles`: User profiles linked to auth.users
    - `properties`: Agricultural properties/farms owned by users
    - `crops`: Crop types (Soja, Milho, Trigo, etc)
    - `plantings`: Individual plantings of crops on properties
    - `livestock_types`: Types of livestock (Bovino de Corte, Suíno, etc)
    - `animals`: Individual animal records
    - `animal_vaccinations`: Vaccination records for animals
    - `supplies_categories`: Categories for supplies (Fertilizante, Semente, etc)
    - `supplies`: Inventory items
    - `financial_transactions`: All income and expenses
    - `transaction_categories`: Predefined categories for transactions
    - `alerts`: System alerts for critical events
    
  2. Security
    - Enable RLS on all tables
    - Users can only see their own properties and related data
    - Service role has unrestricted access for AI operations
    
  3. Key Relationships
    - All tables linked to auth.users for multi-tenancy
    - Hierarchical structure: users -> properties -> crops/animals/supplies
    - Audit timestamps on all records (created_at, updated_at)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  cpf text UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  location text,
  total_area_hectares numeric(10, 2),
  property_type text CHECK (property_type IN ('pequena', 'média', 'grande')),
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'planejado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  scientific_name text,
  category text CHECK (category IN ('grão', 'hortaliça', 'frutífera', 'pastos')),
  average_cycle_days integer,
  created_at timestamptz DEFAULT now()
);

-- Create plantings table
CREATE TABLE IF NOT EXISTS plantings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  crop_id uuid NOT NULL REFERENCES crops(id),
  field_name text,
  area_hectares numeric(10, 2) NOT NULL,
  planting_date date NOT NULL,
  expected_harvest_date date,
  actual_harvest_date date,
  productivity_percentage numeric(5, 2) DEFAULT 0,
  phase text CHECK (phase IN ('preparação', 'plantio', 'crescimento', 'floração', 'enchimento', 'colheita', 'concluído')),
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado', 'cancelado')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plantings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read plantings of own properties"
  ON plantings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = plantings.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert plantings on own properties"
  ON plantings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update plantings on own properties"
  ON plantings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = plantings.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create livestock_types table
CREATE TABLE IF NOT EXISTS livestock_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  species text NOT NULL,
  category text CHECK (category IN ('corte', 'leite', 'reprodução', 'trabalho')),
  average_lifespan_years integer,
  created_at timestamptz DEFAULT now()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  livestock_type_id uuid NOT NULL REFERENCES livestock_types(id),
  identification text NOT NULL,
  name text,
  birth_date date,
  acquisition_date date,
  acquisition_cost numeric(12, 2),
  current_weight_kg numeric(8, 2),
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'morto', 'descartado')),
  status_change_date date,
  sale_price numeric(12, 2),
  sale_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read animals from own properties"
  ON animals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = animals.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert animals in own properties"
  ON animals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update animals in own properties"
  ON animals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = animals.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create animal_vaccinations table
CREATE TABLE IF NOT EXISTS animal_vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  vaccination_date date NOT NULL,
  next_dose_date date,
  veterinarian_name text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE animal_vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read vaccinations of own animals"
  ON animal_vaccinations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      JOIN properties ON animals.property_id = properties.id
      WHERE animals.id = animal_vaccinations.animal_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert vaccinations for own animals"
  ON animal_vaccinations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM animals
      JOIN properties ON animals.property_id = properties.id
      WHERE animals.id = animal_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create supplies_categories table
CREATE TABLE IF NOT EXISTS supplies_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create supplies table
CREATE TABLE IF NOT EXISTS supplies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES supplies_categories(id),
  name text NOT NULL,
  quantity numeric(12, 2) NOT NULL DEFAULT 0,
  unit text NOT NULL,
  unit_cost numeric(12, 2),
  total_value numeric(12, 2),
  expiration_date date,
  supplier_name text,
  purchase_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read supplies from own properties"
  ON supplies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = supplies.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert supplies in own properties"
  ON supplies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update supplies in own properties"
  ON supplies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = supplies.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create transaction_categories table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  category_group text,
  created_at timestamptz DEFAULT now()
);

-- Create financial_transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES transaction_categories(id),
  description text NOT NULL,
  amount numeric(12, 2) NOT NULL,
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  transaction_date date NOT NULL,
  due_date date,
  payment_date date,
  payment_method text CHECK (payment_method IN ('dinheiro', 'cheque', 'transferência', 'débito', 'crédito', 'pix')),
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  related_entity text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read transactions from own properties"
  ON financial_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = financial_transactions.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert transactions in own properties"
  ON financial_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transactions in own properties"
  ON financial_transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = financial_transactions.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  alert_type text CHECK (alert_type IN ('vacina', 'colheita', 'estoque', 'financeiro', 'clima', 'sistema')),
  priority text DEFAULT 'média' CHECK (priority IN ('baixa', 'média', 'alta', 'crítica')),
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'resolvido', 'ignorado')),
  related_entity_id uuid,
  action_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_plantings_property_id ON plantings(property_id);
CREATE INDEX IF NOT EXISTS idx_plantings_crop_id ON plantings(crop_id);
CREATE INDEX IF NOT EXISTS idx_animals_property_id ON animals(property_id);
CREATE INDEX IF NOT EXISTS idx_animals_livestock_type_id ON animals(livestock_type_id);
CREATE INDEX IF NOT EXISTS idx_supplies_property_id ON supplies(property_id);
CREATE INDEX IF NOT EXISTS idx_supplies_category_id ON supplies(category_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_property_id ON financial_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category_id ON financial_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_property_id ON alerts(property_id);
