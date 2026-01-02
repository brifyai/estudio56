-- Tabla para almacenar URLs de redes sociales y páginas web del usuario
CREATE TABLE IF NOT EXISTS user_social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('website', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'youtube', 'other')),
  url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_social_media ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven y gestionan sus propias URLs
CREATE POLICY "Users can manage their own social media"
ON user_social_media
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_social_media_user ON user_social_media(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_media_platform ON user_social_media(platform);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_user_social_media_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_user_social_media_timestamp ON user_social_media;
CREATE TRIGGER update_user_social_media_timestamp
  BEFORE UPDATE ON user_social_media
  FOR EACH ROW
  EXECUTE FUNCTION update_user_social_media_timestamp();