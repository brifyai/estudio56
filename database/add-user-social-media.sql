-- Tabla para registrar redes sociales del usuario
CREATE TABLE IF NOT EXISTS user_social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  pinterest_url TEXT,
  other_url TEXT,
  business_description TEXT,
  industry TEXT,
  brand_colors TEXT[],
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_social_media ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver y editar solo sus propios datos
CREATE POLICY "Users can manage own social media"
ON user_social_media
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_user_social_media_user_id ON user_social_media(user_id);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_user_social_media_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_social_media_timestamp ON user_social_media;
CREATE TRIGGER update_user_social_media_timestamp
  BEFORE UPDATE ON user_social_media
  FOR EACH ROW
  EXECUTE FUNCTION update_user_social_media_timestamp();

-- Tabla para eventos programados por el usuario
CREATE TABLE IF NOT EXISTS scheduled_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commercial_event_id TEXT,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_category TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'both')),
  aspect_ratio TEXT DEFAULT '9:16',
  style_key TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  generated_flyer_id UUID,
  notes TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE scheduled_generations ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver y editar solo sus propios eventos
CREATE POLICY "Users can manage own scheduled generations"
ON scheduled_generations
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_scheduled_generations_user_id ON scheduled_generations(user_id);
CREATE INDEX idx_scheduled_generations_event_date ON scheduled_generations(event_date);
CREATE INDEX idx_scheduled_generations_status ON scheduled_generations(status);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_scheduled_generations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_scheduled_generations_timestamp ON scheduled_generations;
CREATE TRIGGER update_scheduled_generations_timestamp
  BEFORE UPDATE ON scheduled_generations
  FOR EACH ROW
  EXECUTE FUNCTION update_scheduled_generations_timestamp();