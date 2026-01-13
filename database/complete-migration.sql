-- ============================================
-- MIGRACIÓN COMPLETA - ESTUDIO 56
-- Para Supabase Self-Hosted
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABLAS PRINCIPALES
-- ============================================

-- Tabla de planes
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    credits_hd INTEGER NOT NULL DEFAULT 0,
    drafts INTEGER NOT NULL DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    plan_id UUID REFERENCES user_plans(id) ON DELETE SET NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    drafts INTEGER NOT NULL DEFAULT 0,
    last_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE,
    subscription_status VARCHAR(50) DEFAULT 'inactive'
);

-- Tabla de marcas
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    primary_color VARCHAR(7) DEFAULT '#000000',
    secondary_color VARCHAR(7),
    logo_url TEXT,
    description TEXT,
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de generaciones de flyers
CREATE TABLE IF NOT EXISTS flyer_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    prompt_spanish TEXT,
    prompt_english TEXT,
    style_key VARCHAR(100),
    aspect_ratio VARCHAR(10),
    media_type VARCHAR(50),
    image_quality VARCHAR(20) DEFAULT 'draft',
    draft_image_url TEXT,
    hd_image_url TEXT,
    draft_video_url TEXT,
    hd_video_url TEXT,
    seed INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    plan_id UUID REFERENCES user_plans(id),
    mercadopago_payment_id VARCHAR(255),
    mercadopago_preference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recargas de créditos
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
    mercadopago_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de equivalencias de créditos
CREATE TABLE IF NOT EXISTS credit_equivalences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type VARCHAR(50) NOT NULL UNIQUE,
    credits_required INTEGER NOT NULL DEFAULT 1,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos comerciales
CREATE TABLE IF NOT EXISTS commercial_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    category VARCHAR(100),
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES user_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    mercadopago_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de redes sociales de usuarios
CREATE TABLE IF NOT EXISTS user_social_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    profile_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- ============================================
-- 2. ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan_id ON users(plan_id);
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_flyer_generations_user_id ON flyer_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_flyer_generations_brand_id ON flyer_generations(brand_id);
CREATE INDEX IF NOT EXISTS idx_flyer_generations_created_at ON flyer_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_user_id ON credit_recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_status ON credit_recharges(status);
CREATE INDEX IF NOT EXISTS idx_credit_equivalences_type ON credit_equivalences(media_type);
CREATE INDEX IF NOT EXISTS idx_commercial_events_date ON commercial_events(event_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_media_user_id ON user_social_media(user_id);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyer_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_recharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_media ENABLE ROW LEVEL SECURITY;

-- Políticas para users
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para brands
DROP POLICY IF EXISTS "Users can view own brands" ON brands;
CREATE POLICY "Users can view own brands" ON brands
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own brands" ON brands;
CREATE POLICY "Users can create own brands" ON brands
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own brands" ON brands;
CREATE POLICY "Users can update own brands" ON brands
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own brands" ON brands;
CREATE POLICY "Users can delete own brands" ON brands
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para flyer_generations
DROP POLICY IF EXISTS "Users can view own generations" ON flyer_generations;
CREATE POLICY "Users can view own generations" ON flyer_generations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own generations" ON flyer_generations;
CREATE POLICY "Users can create own generations" ON flyer_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own generations" ON flyer_generations;
CREATE POLICY "Users can update own generations" ON flyer_generations
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own generations" ON flyer_generations;
CREATE POLICY "Users can delete own generations" ON flyer_generations
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own payments" ON payments;
CREATE POLICY "Users can create own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para credit_recharges
DROP POLICY IF EXISTS "Users can view own credit recharges" ON credit_recharges;
CREATE POLICY "Users can view own credit recharges" ON credit_recharges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own credit recharges" ON credit_recharges;
CREATE POLICY "Users can create own credit recharges" ON credit_recharges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own credit recharges" ON credit_recharges;
CREATE POLICY "Users can update own credit recharges" ON credit_recharges
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
CREATE POLICY "Users can create own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_social_media
DROP POLICY IF EXISTS "Users can view own social media" ON user_social_media;
CREATE POLICY "Users can view own social media" ON user_social_media
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own social media" ON user_social_media;
CREATE POLICY "Users can manage own social media" ON user_social_media
    FOR ALL USING (auth.uid() = user_id);

-- Políticas públicas
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON user_plans;
CREATE POLICY "Plans are viewable by everyone" ON user_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Equivalences are viewable by everyone" ON credit_equivalences;
CREATE POLICY "Equivalences are viewable by everyone" ON credit_equivalences
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Events are viewable by everyone" ON commercial_events;
CREATE POLICY "Events are viewable by everyone" ON commercial_events
    FOR SELECT USING (true);

-- ============================================
-- 4. DATOS INICIALES
-- ============================================

-- Insertar planes
INSERT INTO user_plans (name, price, credits_hd, drafts, features) VALUES
('GRATIS', 0.00, 0, 3, ARRAY['3 Borradores/día (Imagen)', 'Solo Visualización (Sin descarga)', 'Sin Créditos HD', 'Sin Generación de Video']),
('ESTOY PARTIENDO', 14990, 40, 200, ARRAY['40 Créditos HD (40 fotos o 4 videos)', '200 Borradores de Imagen', 'Videos HD (Requiere 10 créditos c/u)', 'Sin Carga de Productos']),
('JEFE PYME', 44990, 150, 750, ARRAY['150 Créditos HD (150 fotos o 15 videos)', '750 Borradores de Imagen', 'Videos HD (Costo: 10 créditos)', 'Carga de Productos (PNG)']),
('AGENCIA', 139990, 500, 2500, ARRAY['500 Créditos HD (500 fotos o 50 videos)', '2.500 Borradores de Imagen', 'Licencia Comercial', 'Soporte Humano'])
ON CONFLICT (name) DO NOTHING;

-- Insertar equivalencias de créditos
INSERT INTO credit_equivalences (media_type, credits_required, description) VALUES
('photo_hd', 1, '1 Foto HD = 1 Crédito'),
('video_hd', 10, '1 Video HD = 10 Créditos')
ON CONFLICT (media_type) DO NOTHING;

-- ============================================
-- 5. STORAGE BUCKETS
-- ============================================

-- Crear bucket para logos (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Crear bucket para productos (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para logos
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own logos" ON storage.objects;
CREATE POLICY "Users can update own logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;
CREATE POLICY "Users can delete own logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de storage para productos
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
CREATE POLICY "Authenticated users can upload products"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own products" ON storage.objects;
CREATE POLICY "Users can update own products"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own products" ON storage.objects;
CREATE POLICY "Users can delete own products"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- MIGRACIÓN COMPLETADA
-- ============================================

COMMIT;
