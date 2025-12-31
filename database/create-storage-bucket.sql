-- Crear bucket para almacenar imágenes de flyers
-- NOTA: Este script es solo para referencia. 
-- El bucket debe crearse desde la API de Supabase o el Dashboard.
-- Las políticas RLS se crean directamente en storage.objects

-- Para crear el bucket, usa el Dashboard de Supabase:
-- 1. Ve a Storage -> New Bucket
-- 2. Nombre: flyer-images
-- 3. Marca "Public bucket"
-- 4. Click en Create bucket

-- Luego, ejecuta estas políticas RLS en storage.objects:

/*
-- Policy para lectura pública
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'flyer-images' );

-- Policy para que usuarios suban a su propia carpeta
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);

-- Policy para actualizar sus propias imágenes
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);

-- Policy para eliminar sus propias imágenes
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);
*/

-- Verificar que el bucket existe (después de crearlo desde el Dashboard)
SELECT name, public FROM storage.buckets WHERE name = 'flyer-images';