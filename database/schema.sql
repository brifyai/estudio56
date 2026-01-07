-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_plans table
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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    plan_id UUID REFERENCES user_plans(id) ON DELETE SET NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    drafts INTEGER NOT NULL DEFAULT 0,
    last_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flyers table
CREATE TABLE IF NOT EXISTS flyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    style_key VARCHAR(100) NOT NULL,
    aspect_ratio VARCHAR(10) NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    image_quality VARCHAR(20) NOT NULL DEFAULT 'draft',
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table for tracking purchases
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    plan_id UUID REFERENCES user_plans(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_recharges table for tracking credit purchases
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

-- Create credit_equivalences table for storing credit ratios
CREATE TABLE IF NOT EXISTS credit_equivalences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type VARCHAR(50) NOT NULL UNIQUE,
    credits_required INTEGER NOT NULL DEFAULT 1,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flyers_user_id ON flyers(user_id);
CREATE INDEX IF NOT EXISTS idx_flyers_created_at ON flyers(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_user_id ON credit_recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_status ON credit_recharges(status);
CREATE INDEX IF NOT EXISTS idx_credit_equivalences_type ON credit_equivalences(media_type);

-- Insert default plans (coincide con la interfaz actualizada)
INSERT INTO user_plans (name, price, credits_hd, drafts, features) VALUES
('GRATIS', 0.00, 0, 3, ARRAY['3 Borradores/día (Imagen)', 'Solo Visualización (Sin descarga)', 'Sin Créditos HD', 'Sin Generación de Video']),
('ESTOY PARTIENDO', 14990, 40, 200, ARRAY['40 Créditos HD (40 fotos o 4 videos)', '200 Borradores de Imagen', 'Videos HD (Requiere 10 créditos c/u)', 'Sin Carga de Productos']),
('JEFE PYME', 44990, 150, 750, ARRAY['150 Créditos HD (150 fotos o 15 videos)', '750 Borradores de Imagen', 'Videos HD (Costo: 10 créditos)', 'Carga de Productos (PNG)']),
('AGENCIA', 139990, 500, 2500, ARRAY['500 Créditos HD (500 fotos o 50 videos)', '2.500 Borradores de Imagen', 'Licencia Comercial', 'Soporte Humano'])
ON CONFLICT (name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for flyers table
CREATE POLICY "Users can view own flyers" ON flyers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own flyers" ON flyers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flyers" ON flyers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flyers" ON flyers
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for payments table
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for credit_recharges table
CREATE POLICY "Users can view own credit recharges" ON credit_recharges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own credit recharges" ON credit_recharges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit recharges" ON credit_recharges
    FOR UPDATE USING (auth.uid() = user_id);

-- Public plans are readable by everyone
CREATE POLICY "Plans are viewable by everyone" ON user_plans
    FOR SELECT USING (true);

-- Credit equivalences are readable by everyone
CREATE POLICY "Equivalences are viewable by everyone" ON credit_equivalences
    FOR SELECT USING (true);

-- Insert default credit equivalences
INSERT INTO credit_equivalences (media_type, credits_required, description) VALUES
('photo_hd', 1, '1 Foto HD = 1 Crédito'),
('video_hd', 10, '1 Video HD = 10 Créditos')
ON CONFLICT (media_type) DO NOTHING;