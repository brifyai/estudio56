-- Agregar columna credits_hd a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS credits_hd INTEGER DEFAULT 0 NOT NULL;

-- Agregar comentario a la columna
COMMENT ON COLUMN users.credits_hd IS 'Créditos para generar imágenes en alta definición';

-- Crear índice si es necesario para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_users_credits_hd ON users(credits_hd);
