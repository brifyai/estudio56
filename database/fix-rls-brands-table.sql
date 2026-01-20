-- Script para corregir políticas RLS en tabla brands
-- Permite que usuarios autenticados creen y gestionen sus propias marcas

-- 1. Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'brands';

-- 2. Eliminar políticas existentes que puedan estar causando conflicto
DROP POLICY IF EXISTS "Users can insert own brands" ON public.brands;
DROP POLICY IF EXISTS "Users can view own brands" ON public.brands;
DROP POLICY IF EXISTS "Users can update own brands" ON public.brands;
DROP POLICY IF EXISTS "Users can delete own brands" ON public.brands;

-- 3. Crear política para INSERT (permitir que usuarios autenticados creen sus propias marcas)
CREATE POLICY "Users can insert own brands"
ON public.brands
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Crear política para SELECT (permitir que usuarios vean sus propias marcas)
CREATE POLICY "Users can view own brands"
ON public.brands
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 5. Crear política para UPDATE (permitir que usuarios actualicen sus propias marcas)
CREATE POLICY "Users can update own brands"
ON public.brands
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Crear política para DELETE (permitir que usuarios eliminen sus propias marcas)
CREATE POLICY "Users can delete own brands"
ON public.brands
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. Asegurar que RLS está habilitado
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 8. Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'brands';
