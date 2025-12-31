-- Tabla para rastrear generaciones de flyers con IDs únicos
CREATE TABLE IF NOT EXISTS flyer_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_image_url TEXT NOT NULL, -- URL de la imagen en Supabase Storage
  hd_image_url TEXT, -- URL de la imagen HD (nullable si no se ha generado)
  prompt TEXT NOT NULL,
  style_key TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  seed INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'hd', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_flyer_generations_user_id ON flyer_generations(user_id);

-- Índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_flyer_generations_status ON flyer_generations(status);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_flyer_generations_created_at ON flyer_generations(created_at DESC);

-- Habilitar RLS
ALTER TABLE flyer_generations ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios pueden ver solo sus propias generaciones
CREATE POLICY "Users can view own generations" ON flyer_generations
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Usuarios pueden insertar sus propias generaciones
CREATE POLICY "Users can insert own generations" ON flyer_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Usuarios pueden actualizar sus propias generaciones
CREATE POLICY "Users can update own generations" ON flyer_generations
  FOR UPDATE USING (auth.uid() = user_id);