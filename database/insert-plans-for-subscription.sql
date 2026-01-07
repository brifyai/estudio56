-- Insertar planes con UUIDs válidos para suscripciones MercadoPago
-- Ejecutar en Supabase SQL Editor

-- Verificar estructura de la tabla
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_plans';

-- Generar UUIDs para los planes
-- Estos son UUIDs válidos generados para cada plan

-- Insertar plan "ESTOY PARTIENDO" (UUID: 11111111-1111-1111-1111-111111111111)
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', 'ESTOY PARTIENDO', 14990, 40, ARRAY['40 Créditos HD', '200 Borradores', 'Videos HD (10 créditos)', 'Sin carga de productos'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE name = 'ESTOY PARTIENDO');

-- Insertar plan "JEFE PYME" (UUID: 22222222-2222-2222-2222-222222222222)
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', 'JEFE PYME', 44990, 150, ARRAY['150 Créditos HD', '750 Borradores', 'Videos HD (10 créditos)', 'Carga de Productos PNG'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE name = 'JEFE PYME');

-- Insertar plan "AGENCIA" (UUID: 33333333-3333-3333-3333-333333333333)
INSERT INTO user_plans (id, name, price, credits_per_month, features, created_at, updated_at)
SELECT '33333333-3333-3333-3333-333333333333', 'AGENCIA', 139990, 500, ARRAY['500 Créditos HD', '2500 Borradores', 'Licencia Comercial', 'Soporte Humano'], NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_plans WHERE name = 'AGENCIA');

-- Verificar que los planes fueron insertados
SELECT id, name, price, credits_per_month FROM user_plans ORDER BY price;