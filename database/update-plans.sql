-- Update plans with new Chilean Pesos (CLP) values
-- Run this SQL in Supabase SQL Editor

-- Update plan "GRATIS"
UPDATE user_plans SET 
    price = 0,
    credits_per_month = 5,
    features = ARRAY[
        '5 Borradores/día (Con marca de agua)',
        'Solo Visualización (Sin descarga)',
        'Generación de Video NO disponible',
        'Alta Definición (HD) NO disponible'
    ],
    updated_at = NOW()
WHERE name = 'GRATIS';

-- Update plan "ESTOY PARTIENDO"
UPDATE user_plans SET 
    price = 12990,
    credits_per_month = 50,
    features = ARRAY[
        '50 Imágenes Finales (HD)',
        '∞ Borradores de Imagen',
        'Videos NO disponibles',
        'Carga de Productos NO disponible'
    ],
    updated_at = NOW()
WHERE name = 'ESTOY PARTIENDO';

-- Update plan "JEFE PYME"
UPDATE user_plans SET 
    price = 39990,
    credits_per_month = 250,
    features = ARRAY[
        '250 Imágenes HD',
        '∞ Borradores de Imagen',
        '5 Videos HD (1 semanal)',
        'Carga de Productos (PNG)'
    ],
    updated_at = NOW()
WHERE name = 'JEFE PYME';

-- Update plan "AGENCIA"
UPDATE user_plans SET 
    price = 99990,
    credits_per_month = 1000,
    features = ARRAY[
        '1000 Imágenes HD (4x)',
        '20 Videos HD (4x)',
        'Licencia Comercial',
        'Soporte Humano'
    ],
    updated_at = NOW()
WHERE name = 'AGENCIA';

-- Verify the updates
SELECT name, price, credits_per_month, features FROM user_plans ORDER BY price;