-- Script para corregir políticas RLS en tabla users
-- Permite que usuarios autenticados creen su propio registro

-- 1. Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'users';

-- 2. Eliminar políticas existentes que puedan estar causando conflicto
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own record" ON public.users;

-- 3. Crear política para INSERT (permitir que usuarios autenticados creen su propio registro)
CREATE POLICY "Users can insert own record"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 4. Crear política para SELECT (permitir que usuarios vean su propio registro)
CREATE POLICY "Users can view own record"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 5. Crear política para UPDATE (permitir que usuarios actualicen su propio registro)
CREATE POLICY "Users can update own record"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Asegurar que RLS está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Verificar que las políticas se crearon correctamente
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
WHERE tablename = 'users';
