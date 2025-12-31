-- ============================================
-- ACTUALIZAR PLANES CON IVA CHILE (19%)
-- ============================================

-- 1. Agregar columna para precio con IVA si no existe
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS price_with_iva INTEGER;

-- 2. Actualizar todos los planes con precio + IVA (19%)
-- Plan FREE (sin IVA, precio 0)
UPDATE user_plans SET 
    price_with_iva = 0,
    updated_at = NOW()
WHERE name = 'GRATIS';

-- Plan ESTOY PARTIENDO: $12.990 + 19% = $15.458
UPDATE user_plans SET 
    price_with_iva = 15458,
    updated_at = NOW()
WHERE name = 'ESTOY PARTIENDO';

-- Plan JEFE PYME: $39.990 + 19% = $47.588
UPDATE user_plans SET 
    price_with_iva = 47588,
    updated_at = NOW()
WHERE name = 'JEFE PYME';

-- Plan AGENCIA: $99.990 + 19% = $118.988
UPDATE user_plans SET 
    price_with_iva = 118988,
    updated_at = NOW()
WHERE name = 'AGENCIA';

-- 3. Verificar actualización
SELECT 
    name,
    price AS "Precio Neto",
    price_with_iva AS "Precio con IVA",
    (price_with_iva - price) AS "IVA (19%)",
    credits_per_month AS "Créditos/Mes"
FROM user_plans 
ORDER BY price;

-- ============================================
-- VISTA SIMPLIFICADA PARA MOSTRAR PRECIOS
-- ============================================
DROP VIEW IF EXISTS plans_with_iva;

CREATE VIEW plans_with_iva AS
SELECT 
    id,
    name,
    price AS price_net,
    price_with_iva,
    credits_per_month,
    features,
    created_at,
    updated_at
FROM user_plans;

-- Otorgar acceso
GRANT SELECT ON plans_with_iva TO authenticated;
GRANT SELECT ON plans_with_iva TO anon;

-- Verificar vista
SELECT * FROM plans_with_iva ORDER BY price_net;