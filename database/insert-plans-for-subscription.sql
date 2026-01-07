-- Insertar planes si no existen (para suscripciones MercadoPago)
-- Ejecutar en Supabase SQL Editor

-- Verificar si existen los planes
SELECT id, name, price FROM user_plans ORDER BY price;

-- Insertar plan "GRATIS" si no existe
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT 'GRATIS', 'GRATIS', 0, 5, ARRAY['3 Borradores/día (Imagen)', 'Solo Visualización', 'Sin Créditos HD', 'Sin Video'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE id = 'GRATIS');

-- Insertar plan "ESTOY PARTIENDO" si no existe
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT 'ESTOY PARTIENDO', 'ESTOY PARTIENDO', 14990, 40, ARRAY['40 Créditos HD', '200 Borradores', 'Videos HD (10 créditos)', 'Sin carga de productos'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE id = 'ESTOY PARTIENDO');

-- Insertar plan "JEFE PYME" si no existe
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT 'JEFE PYME', 'JEFE PYME', 44990, 150, ARRAY['150 Créditos HD', '750 Borradores', 'Videos HD (10 créditos)', 'Carga de Productos PNG'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE id = 'JEFE PYME');

-- Insertar plan "AGENCIA" si no existe
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT 'AGENCIA', 'AGENCIA', 139990, 500, ARRAY['500 Créditos HD', '2500 Borradores', 'Licencia Comercial', 'Soporte Humano'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE id = 'AGENCIA');

-- Verificar que los planes fueron insertados
SELECT id, name, price, credits_per_month FROM user_plans ORDER BY price;