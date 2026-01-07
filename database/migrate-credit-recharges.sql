-- ============================================
-- Script de migración para recargas de créditos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Crear tabla credit_recharges
CREATE TABLE IF NOT EXISTS credit_recharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recharge_type VARCHAR(50) NOT NULL,
    credits_hd INTEGER NOT NULL DEFAULT 0,
    drafts INTEGER NOT NULL DEFAULT 0,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    mercadopago_preference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para credit_recharges
CREATE INDEX IF NOT EXISTS idx_credit_recharges_user_id ON credit_recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_status ON credit_recharges(status);

-- 3. Crear tabla credit_equivalences
CREATE TABLE IF NOT EXISTS credit_equivalences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type VARCHAR(50) NOT NULL UNIQUE,
    credits_required INTEGER NOT NULL DEFAULT 1,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear índices para equivalences
CREATE INDEX IF NOT EXISTS idx_credit_equivalences_type ON credit_equivalences(media_type);

-- 5. Habilitar RLS para las nuevas tablas
ALTER TABLE credit_recharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_equivalences ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS (primero verificar si existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_recharges' AND policyname = 'Users can view own credit recharges') THEN
        CREATE POLICY "Users can view own credit recharges" ON credit_recharges
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_recharges' AND policyname = 'Users can create own credit recharges') THEN
        CREATE POLICY "Users can create own credit recharges" ON credit_recharges
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_recharges' AND policyname = 'Users can update own credit recharges') THEN
        CREATE POLICY "Users can update own credit recharges" ON credit_recharges
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_equivalences' AND policyname = 'Equivalences are viewable by everyone') THEN
        CREATE POLICY "Equivalences are viewable by everyone" ON credit_equivalences
            FOR SELECT USING (true);
    END IF;
END $$;

-- 7. Insertar equivalencias por defecto (si no existen)
INSERT INTO credit_equivalences (media_type, credits_required, description) VALUES
('photo_hd', 1, '1 Foto HD = 1 Crédito'),
('video_hd', 10, '1 Video HD = 10 Créditos')
ON CONFLICT (media_type) DO NOTHING;

-- 8. Verificar que las tablas se crearon correctamente
SELECT 'credit_recharges' as table_name, count(*) as row_count FROM credit_recharges
UNION ALL
SELECT 'credit_equivalences' as table_name, count(*) as row_count FROM credit_equivalences;