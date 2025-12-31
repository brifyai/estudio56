-- Paso 1: Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Paso 2: Crear tabla user_plans
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    credits_per_month INTEGER NOT NULL DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 3: Crear tabla users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    plan_id UUID REFERENCES user_plans(id) ON DELETE SET NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    last_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 4: Crear tabla flyers
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

-- Paso 5: Crear índices
CREATE INDEX IF NOT EXISTS idx_flyers_user_id ON flyers(user_id);
CREATE INDEX IF NOT EXISTS idx_flyers_created_at ON flyers(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Paso 6: Insertar planes por defecto (coincide con la interfaz)
INSERT INTO user_plans (name, price, credits_per_month, features) VALUES
('GRATIS', 0.00, 5, ARRAY['5 Borradores Diarios (H2O)', 'Solo Visualización', 'Sin Generación de Video', 'Sin Descarga de Archivos']),
('ESTOY PARTIENDO', 12.990, 50, ARRAY['50 Imágenes Finales (HD)', '∞ Borradores de Imagen', 'Sin Generación de Video', 'Sin Carga de Productos']),
('JEFE PYME', 39.990, 250, ARRAY['250 Imágenes HD', '∞ Borradores de Imagen', '5 Videos HD (Limitado)', 'Carga de Productos']),
('AGENCIA', 99.990, 1000, ARRAY['1000 Imágenes HD (4x)', '20 Videos HD (4x)', 'Licencia Comercial Extendida', 'Soporte WhatsApp (Humano)'])
ON CONFLICT (name) DO NOTHING;