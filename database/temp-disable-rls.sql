-- Script temporal para deshabilitar RLS y crear usuario manualmente
-- IMPORTANTE: Ejecutar este script SOLO si los otros métodos no funcionan
-- Después de crear el usuario, ejecutar temp-enable-rls.sql

-- 1. Deshabilitar RLS temporalmente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Crear usuario manualmente (reemplaza con tus datos)
INSERT INTO public.users (
  id, 
  email, 
  name, 
  created_at, 
  updated_at
)
VALUES (
  'fd15a329-9911-4f4c-a03e-42c941f7b14b',
  'camiloalegriabarra@gmail.com',
  'Camilo Alegría',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = NOW();

-- 3. Verificar que el usuario se creó
SELECT * FROM public.users WHERE id = 'fd15a329-9911-4f4c-a03e-42c941f7b14b';

-- 4. IMPORTANTE: Después de verificar, ejecutar temp-enable-rls.sql para rehabilitar RLS
