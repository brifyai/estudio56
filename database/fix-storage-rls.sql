-- Fix: Asegurar que las políticas RLS estén aplicadas correctamente
-- Ejecutar en: https://zskunemvffyxtfqyzm.supabase.co/sql Editor

-- 1. Habilitar RLS en storage.objects si no está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Ver políticas existentes
SELECT policyname, operation, definition
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- 3. Si no existen políticas, crearlas:
-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Crear políticas nuevas
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'flyer-images' );

CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'flyer-images' );

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'flyer-images' );

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'flyer-images' );

-- 4. Verificar
SELECT policyname, operation, definition
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';