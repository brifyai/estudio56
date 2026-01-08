-- Agregar columna is_admin para marcar usuarios desarrolladores
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna is_admin
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Marcar al desarrollador como admin
UPDATE users SET is_admin = TRUE WHERE email = 'camiloalegriabarra@gmail.com';

-- 3. Verificar
SELECT email, plan_id, is_admin FROM users WHERE email = 'camiloalegriabarra@gmail.com';

-- 4. Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;