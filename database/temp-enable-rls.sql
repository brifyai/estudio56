-- Script para rehabilitar RLS después de crear usuario manualmente
-- Ejecutar DESPUÉS de temp-disable-rls.sql

-- 1. Habilitar RLS nuevamente
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Verificar que RLS está habilitado
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'users';

-- 3. Verificar políticas activas
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'users';

-- 4. Verificar que el usuario puede acceder a su propio registro
-- (Ejecutar esto desde la aplicación o con el token del usuario)
-- SELECT * FROM public.users WHERE id = auth.uid();
