-- Agregar columna subscription_status a la tabla users
-- Ejecutar en Supabase SQL Editor

-- Verificar si existe la columna
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'subscription_status';

-- Agregar la columna si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT NULL;

-- Agregar también otras columnas que podrían hacer falta
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255) DEFAULT NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS next_renewal_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Verificar la estructura de la tabla users
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Crear índice para subscription_id
CREATE INDEX IF NOT EXISTS idx_users_subscription_id ON users(subscription_id);