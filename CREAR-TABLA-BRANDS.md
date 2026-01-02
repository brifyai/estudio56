# Crear Tabla Brands en Supabase

## Problema
La tabla `brands` no existe en la base de datos y los endpoints de SQL de Supabase no están disponibles para crear tablas automáticamente.

## Solución Manual

### Paso 1: Acceder al Dashboard de Supabase
1. Ir a https://supabase.com/dashboard
2. Seleccionar el proyecto `zskunemvffyqyxtfqyzm`
3. Ir a la sección **SQL Editor**

### Paso 2: Ejecutar el siguiente SQL

```sql
-- Create brands table for storing brand/marketing information
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    website_url TEXT,
    instagram VARCHAR(100),
    tiktok VARCHAR(100),
    facebook VARCHAR(255),
    primary_color VARCHAR(20) DEFAULT '#000000',
    secondary_color VARCHAR(20) DEFAULT '#FFFFFF',
    industry VARCHAR(100),
    notification_settings JSONB DEFAULT '{"enabled": false, "daysBeforeEvent": [7, 3, 1]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_is_default ON brands(user_id, is_default);

-- Enable RLS for brands table
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
CREATE POLICY "Users can view own brands" ON brands
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own brands" ON brands
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON brands
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON brands
    FOR DELETE USING (auth.uid() = user_id);
```

### Paso 3: Verificar
Ejecutar:
```sql
SELECT * FROM brands LIMIT 1;
```

Si no hay errores, la tabla está creada correctamente.

### Paso 4: Recargar la aplicación
Volver a la aplicación y recargar la página (F5).

## Estado Actual del Código
- El código ya maneja graciosamente la ausencia de la tabla
- Si la tabla no existe, se creará una marca por defecto automáticamente
- El error en consola es esperado hasta que se cree la tabla manualmente