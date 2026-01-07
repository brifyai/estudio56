-- Migration SQL for updating plans table
-- Execute this in Supabase SQL Editor

-- 1. Add new columns if they don't exist
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS credits_hd INTEGER DEFAULT 0;
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS drafts INTEGER DEFAULT 0;

-- 2. Update each plan with new values
UPDATE user_plans SET 
  price = 0.00,
  credits_hd = 0,
  drafts = 3,
  features = ARRAY['3 Borradores/día (Imagen)', 'Solo Visualización (Sin descarga)', 'Sin Créditos HD', 'Sin Generación de Video']
WHERE name = 'GRATIS';

UPDATE user_plans SET 
  price = 14990,
  credits_hd = 40,
  drafts = 200,
  features = ARRAY['40 Créditos HD (40 fotos o 4 videos)', '200 Borradores de Imagen', 'Videos HD (Requiere 10 créditos c/u)', 'Sin Carga de Productos']
WHERE name = 'ESTOY PARTIENDO';

UPDATE user_plans SET 
  price = 44990,
  credits_hd = 150,
  drafts = 750,
  features = ARRAY['150 Créditos HD (150 fotos o 15 videos)', '750 Borradores de Imagen', 'Videos HD (Costo: 10 créditos)', 'Carga de Productos (PNG)']
WHERE name = 'JEFE PYME';

UPDATE user_plans SET 
  price = 139990,
  credits_hd = 500,
  drafts = 2500,
  features = ARRAY['500 Créditos HD (500 fotos o 50 videos)', '2.500 Borradores de Imagen', 'Licencia Comercial', 'Soporte Humano']
WHERE name = 'AGENCIA';

-- 3. Verify the update
SELECT name, price, credits_hd, drafts, features FROM user_plans ORDER BY price;