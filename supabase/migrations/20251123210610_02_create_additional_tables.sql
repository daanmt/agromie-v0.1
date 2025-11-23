/*
  # Additional Tables and Audit System
  
  This migration creates supporting tables for production tracking, audit logs, and AI interaction history.
  
  1. New Tables
    - `production_lots`: Batches of products for traceability
    - `lot_history`: Tracking history of production lots
    - `ai_interactions`: Log of all AI assistant interactions for audit
    - `weather_data`: Historical weather data for properties
    - `production_notes`: Daily notes and observations for management
    
  2. Security
    - Enable RLS on all tables
    - AI interactions are logged for transparency and audit purposes
    
  3. Purpose
    - Traceability: Track products from farm to sale
    - Audit: Complete history of AI actions and user approvals
    - Analytics: Historical data for reports and analysis
    - Weather: Integration point for weather data
*/

-- Create production_lots table (for traceability)
CREATE TABLE IF NOT EXISTS production_lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lot_code text NOT NULL UNIQUE,
  product_type text NOT NULL CHECK (product_type IN ('grão', 'carne', 'leite', 'hortaliça', 'frutífera')),
  source_entity_id uuid,
  source_entity_type text CHECK (source_entity_type IN ('plantings', 'animals', 'supplies')),
  quantity numeric(12, 2) NOT NULL,
  unit text NOT NULL,
  production_date date NOT NULL,
  qr_code text UNIQUE,
  certifications text[],
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'processado', 'descartado')),
  sale_date date,
  sale_price numeric(12, 2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read lots from own properties"
  ON production_lots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = production_lots.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert lots in own properties"
  ON production_lots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lots in own properties"
  ON production_lots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = production_lots.property_id
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

-- Create lot_history table (for tracking changes)
CREATE TABLE IF NOT EXISTS lot_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES production_lots(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('criado', 'movido', 'processado', 'vendido', 'certificado')),
  event_description text,
  location text,
  responsible_user uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lot_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read lot history of own lots"
  ON lot_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM production_lots
      JOIN properties ON production_lots.property_id = properties.id
      WHERE production_lots.id = lot_history.lot_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create ai_interactions table (for audit trail)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  intent text,
  action_type text CHECK (action_type IN ('query', 'create', 'update', 'delete', 'report')),
  action_entity text,
  action_entity_id uuid,
  action_executed boolean DEFAULT false,
  action_result text,
  required_confirmation boolean DEFAULT false,
  user_confirmed boolean,
  confirmation_timestamp timestamptz,
  error_message text,
  tokens_used integer,
  source text DEFAULT 'web' CHECK (source IN ('web', 'whatsapp', 'api')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own AI interactions"
  ON ai_interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "AI can insert interactions for users"
  ON ai_interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  measurement_date date NOT NULL,
  temperature_min numeric(5, 2),
  temperature_max numeric(5, 2),
  temperature_avg numeric(5, 2),
  humidity_percentage numeric(5, 2),
  precipitation_mm numeric(6, 2),
  wind_speed_kmh numeric(5, 2),
  uv_index numeric(3, 1),
  soil_moisture_percentage numeric(5, 2),
  weather_condition text,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read weather data from own properties"
  ON weather_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = weather_data.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert weather data for own properties"
  ON weather_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create production_notes table
CREATE TABLE IF NOT EXISTS production_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  note_date date NOT NULL,
  category text CHECK (category IN ('geral', 'safra', 'animal', 'insumo', 'clima', 'financeiro')),
  content text NOT NULL,
  attachments text[],
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read notes from own properties"
  ON production_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = production_notes.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notes for own properties"
  ON production_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_production_lots_property_id ON production_lots(property_id);
CREATE INDEX IF NOT EXISTS idx_production_lots_lot_code ON production_lots(lot_code);
CREATE INDEX IF NOT EXISTS idx_lot_history_lot_id ON lot_history(lot_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_property_id ON ai_interactions(property_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_weather_data_property_id ON weather_data(property_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_measurement_date ON weather_data(measurement_date);
CREATE INDEX IF NOT EXISTS idx_production_notes_property_id ON production_notes(property_id);
CREATE INDEX IF NOT EXISTS idx_production_notes_note_date ON production_notes(note_date);
