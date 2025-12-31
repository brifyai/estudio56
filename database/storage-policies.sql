-- Políticas RLS para el bucket flyer-images
-- Ejecutar en el SQL Editor de Supabase

-- 1. Policy para lectura pública (todos pueden ver)
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'flyer-images' );

-- 2. Policy para que usuarios suban a su propia carpeta
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);

-- 3. Policy para actualizar sus propias imágenes
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);

-- 4. Policy para eliminar sus propias imágenes
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'flyer-images' AND
  (storage.foldername)[1] = auth.uid()::text
);

-- Verificar que las políticas se crearon
SELECT policyname, operation, definition
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';