-- Tabla para el Calendario Comercial Integrado
-- Ejecutar solo si la tabla no existe

CREATE TABLE IF NOT EXISTS commercial_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  days_advance INTEGER DEFAULT 7,
  category TEXT NOT NULL CHECK (category IN ('festivo', 'consumo', 'comercio', 'marketing', 'especial')),
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS si no está habilitado
ALTER TABLE commercial_events ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Allow authenticated access to commercial events" ON commercial_events;
DROP POLICY IF EXISTS "Allow admins to manage commercial events" ON commercial_events;

-- Eliminar trigger y función con CASCADE
DROP TRIGGER IF EXISTS update_commercial_events_timestamp ON commercial_events;
DROP FUNCTION IF EXISTS update_commercial_events_timestamp() CASCADE;

-- Crear políticas
CREATE POLICY "Allow authenticated access to commercial events"
ON commercial_events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to manage commercial events"
ON commercial_events
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.email = 'admin@estudio56.cl'
  )
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_commercial_events_date ON commercial_events(date);
CREATE INDEX IF NOT EXISTS idx_commercial_events_category ON commercial_events(category);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_commercial_events_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp
CREATE TRIGGER update_commercial_events_timestamp
  BEFORE UPDATE ON commercial_events
  FOR EACH ROW
  EXECUTE FUNCTION update_commercial_events_timestamp();