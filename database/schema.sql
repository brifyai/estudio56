-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    credits_per_month INTEGER NOT NULL DEFAULT 0,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flyers_user_id ON flyers(user_id);
CREATE INDEX IF NOT EXISTS idx_flyers_created_at ON flyers(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default plans (coincide con la interfaz)
INSERT INTO user_plans (name, price, credits_per_month, features) VALUES
('GRATIS', 0.00, 5, ARRAY['5 Borradores Diarios (H2O)', 'Solo Visualización', 'Sin Generación de Video', 'Sin Descarga de Archivos']),
('ESTOY PARTIENDO', 12.990, 50, ARRAY['50 Imágenes Finales (HD)', '∞ Borradores de Imagen', 'Sin Generación de Video', 'Sin Carga de Productos']),
('JEFE PYME', 39.990, 250, ARRAY['250 Imágenes HD', '∞ Borradores de Imagen', '5 Videos HD (Limitado)', 'Carga de Productos']),
('AGENCIA', 99.990, 1000, ARRAY['1000 Imágenes HD (4x)', '20 Videos HD (4x)', 'Licencia Comercial Extendida', 'Soporte WhatsApp (Humano)'])
ON CONFLICT (name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;

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

-- Public plans are readable by everyone
CREATE POLICY "Plans are viewable by everyone" ON user_plans
    FOR SELECT USING (true);