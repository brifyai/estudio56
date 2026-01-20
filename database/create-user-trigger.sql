-- Trigger para crear automáticamente usuario en public.users cuando se registra en auth.users
-- Esta es la mejor práctica para sincronizar auth.users con public.users

-- 1. Crear función que se ejecutará cuando se cree un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar nuevo usuario en public.users con datos de auth.users
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Evitar error si ya existe
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear trigger que ejecuta la función después de INSERT en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Verificar que el trigger se creó correctamente
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 4. IMPORTANTE: Crear usuario actual si no existe (ejecutar solo una vez)
-- Reemplaza 'fd15a329-9911-4f4c-a03e-42c941f7b14b' con tu ID de usuario
-- Reemplaza 'camiloalegriabarra@gmail.com' con tu email
INSERT INTO public.users (id, email, name, created_at, updated_at)
VALUES (
  'fd15a329-9911-4f4c-a03e-42c941f7b14b',
  'camiloalegriabarra@gmail.com',
  'Camilo Alegría',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- 5. Verificar que el usuario se creó
SELECT id, email, name, created_at FROM public.users WHERE id = 'fd15a329-9911-4f4c-a03e-42c941f7b14b';
