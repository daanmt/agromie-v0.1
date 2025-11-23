/*
  # Populate Base Reference Data
  
  This migration inserts foundational reference data that is shared across all users.
  These are not user-specific data, but system-wide reference tables.
  
  Data includes:
  - Common crop types and their information
  - Livestock types and characteristics
  - Supply categories
  - Transaction categories for financial management
*/

-- Insert common crops
INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Soja', 'Glycine max', 'grão', 120
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Soja');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Milho', 'Zea mays', 'grão', 140
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Milho');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Trigo', 'Triticum aestivum', 'grão', 120
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Trigo');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Arroz', 'Oryza sativa', 'grão', 150
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Arroz');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Feijão', 'Phaseolus vulgaris', 'grão', 90
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Feijão');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Cana-de-açúcar', 'Saccharum officinarum', 'grão', 300
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Cana-de-açúcar');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Tomate', 'Solanum lycopersicum', 'hortaliça', 90
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Tomate');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Alface', 'Lactuca sativa', 'hortaliça', 45
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Alface');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Cenoura', 'Daucus carota', 'hortaliça', 80
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Cenoura');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Abacaxi', 'Ananas comosus', 'frutífera', 500
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Abacaxi');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Banana', 'Musa acuminata', 'frutífera', 270
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Banana');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Maçã', 'Malus domestica', 'frutífera', 180
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Maçã');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Capim Braquiária', 'Brachiaria decumbens', 'pastos', 365
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Capim Braquiária');

INSERT INTO crops (name, scientific_name, category, average_cycle_days) 
SELECT 'Capim Tanzânia', 'Panicum maximum', 'pastos', 365
WHERE NOT EXISTS (SELECT 1 FROM crops WHERE name = 'Capim Tanzânia');

-- Insert livestock types
INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Bovino de Corte', 'Bos taurus', 'corte', 5
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Bovino de Corte');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Bovino Leiteiro', 'Bos taurus', 'leite', 8
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Bovino Leiteiro');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Suíno', 'Sus scrofa domesticus', 'corte', 3
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Suíno');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Frango de Corte', 'Gallus gallus domesticus', 'corte', 2
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Frango de Corte');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Galinha Poedeira', 'Gallus gallus domesticus', 'leite', 3
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Galinha Poedeira');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Cabra Leiteira', 'Capra aegagrus hircus', 'leite', 10
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Cabra Leiteira');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Ovelha', 'Ovis aries', 'corte', 7
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Ovelha');

INSERT INTO livestock_types (name, species, category, average_lifespan_years) 
SELECT 'Cavalo', 'Equus ferus caballus', 'trabalho', 25
WHERE NOT EXISTS (SELECT 1 FROM livestock_types WHERE name = 'Cavalo');

-- Insert supply categories
INSERT INTO supplies_categories (name, description) 
SELECT 'Fertilizantes', 'Adubos químicos e orgânicos'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Fertilizantes');

INSERT INTO supplies_categories (name, description) 
SELECT 'Sementes', 'Sementes e mudas para plantio'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Sementes');

INSERT INTO supplies_categories (name, description) 
SELECT 'Defensivos', 'Agroquímicos e pesticidas'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Defensivos');

INSERT INTO supplies_categories (name, description) 
SELECT 'Veterinário', 'Vacinas, medicamentos e suplementos animais'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Veterinário');

INSERT INTO supplies_categories (name, description) 
SELECT 'Equipamentos', 'Ferramentas e máquinas agrícolas'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Equipamentos');

INSERT INTO supplies_categories (name, description) 
SELECT 'Combustível', 'Gasolina, diesel e lubrificantes'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Combustível');

INSERT INTO supplies_categories (name, description) 
SELECT 'Alimentos', 'Ração e alimentos para animais'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Alimentos');

INSERT INTO supplies_categories (name, description) 
SELECT 'Embalagem', 'Sacos, caixas e materiais de embalagem'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Embalagem');

INSERT INTO supplies_categories (name, description) 
SELECT 'Água', 'Suprimentos relacionados a água e irrigação'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Água');

INSERT INTO supplies_categories (name, description) 
SELECT 'Outros', 'Diversos'
WHERE NOT EXISTS (SELECT 1 FROM supplies_categories WHERE name = 'Outros');

-- Insert transaction categories
INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Venda de Grãos', 'receita', 'produto'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Venda de Grãos');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Venda de Carne', 'receita', 'produto'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Venda de Carne');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Venda de Leite', 'receita', 'produto'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Venda de Leite');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Venda de Hortaliças', 'receita', 'produto'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Venda de Hortaliças');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Compra de Sementes', 'despesa', 'insumo'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Compra de Sementes');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Compra de Fertilizantes', 'despesa', 'insumo'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Compra de Fertilizantes');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Compra de Defensivos', 'despesa', 'insumo'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Compra de Defensivos');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Compra de Ração', 'despesa', 'insumo'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Compra de Ração');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Mão de Obra', 'despesa', 'pessoal'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Mão de Obra');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Água e Energia', 'despesa', 'utilidade'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Água e Energia');

INSERT INTO transaction_categories (name, type, category_group) 
SELECT 'Outras Despesas', 'despesa', 'outro'
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE name = 'Outras Despesas');
