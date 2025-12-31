-- ============================================
-- ACTUALIZAR TABLA CON PRECIOS NETO, IVA Y TOTAL
-- ============================================

-- 1. Agregar columnas para IVA si no existen
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS iva_percentage DECIMAL(5,2) DEFAULT 19.00;
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS iva_amount INTEGER;
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS price_with_iva INTEGER;

-- 2. Actualizar plan FREE (0)
UPDATE user_plans SET 
    iva_percentage = 19.00,
    iva_amount = 0,
    price_with_iva = 0,
    updated_at = NOW()
WHERE name = 'GRATIS';

-- 3. Actualizar plan ESTOY PARTIENDO
-- Neto: $12.990, IVA: $2.468, Total: $15.458
UPDATE user_plans SET 
    iva_percentage = 19.00,
    iva_amount = 2468,
    price_with_iva = 15458,
    updated_at = NOW()
WHERE name = 'ESTOY PARTIENDO';

-- 4. Actualizar plan JEFE PYME
-- Neto: $39.990, IVA: $7.598, Total: $47.588
UPDATE user_plans SET 
    iva_percentage = 19.00,
    iva_amount = 7598,
    price_with_iva = 47588,
    updated_at = NOW()
WHERE name = 'JEFE PYME';

-- 5. Actualizar plan AGENCIA
-- Neto: $99.990, IVA: $18.998, Total: $118.988
UPDATE user_plans SET 
    iva_percentage = 19.00,
    iva_amount = 18998,
    price_with_iva = 118988,
    updated_at = NOW()
WHERE name = 'AGENCIA';

-- 6. Verificar actualización
SELECT 
    name,
    price AS "Neto",
    iva_amount AS "IVA (19%)",
    price_with_iva AS "Total",
    iva_percentage AS "IVA %"
FROM user_plans 
ORDER BY price;

-- 7. Crear vista para mostrar precios separados
DROP VIEW IF EXISTS plans_with_iva_details;

CREATE VIEW plans_with_iva_details AS
SELECT 
    id,
    name,
    price AS price_net,
    iva_percentage,
    iva_amount,
    price_with_iva,
    credits_per_month,
    features,
    created_at,
    updated_at
FROM user_plans;

-- 8. Otorgar permisos
GRANT SELECT ON plans_with_iva_details TO authenticated;
GRANT SELECT ON plans_with_iva_details TO anon;

-- Verificar vista
SELECT * FROM plans_with_iva_details ORDER BY price;