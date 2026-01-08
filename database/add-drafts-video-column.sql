-- Agregar campo drafts_video a users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS drafts_video INTEGER NOT NULL DEFAULT 0;

-- Agregar campo drafts_video a user_plans table
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS drafts_video INTEGER NOT NULL DEFAULT 0;

-- Actualizar planes existentes con valores por defecto (0 videos de borrador)
UPDATE user_plans SET drafts_video = 0 WHERE drafts_video IS NULL;

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_plans
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON user_plans;
CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON user_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();