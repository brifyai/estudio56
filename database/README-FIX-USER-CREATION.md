# Solución: Error 403 al crear usuario en public.users

## Problema
Usuario autenticado vía Google OAuth no puede crear su registro en `public.users` debido a políticas RLS (Row Level Security).

## Usuario afectado
- **ID**: `fd15a329-9911-4f4c-a03e-42c941f7b14b`
- **Email**: `camiloalegriabarra@gmail.com`

---

## 🎯 SOLUCIÓN RECOMENDADA: Trigger Automático

**Archivo**: `create-user-trigger.sql`

Esta es la **mejor práctica** porque:
- ✅ Crea usuarios automáticamente cuando se registran
- ✅ No requiere lógica en el cliente
- ✅ Funciona para todos los usuarios futuros
- ✅ Mantiene RLS habilitado

### Pasos:
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `create-user-trigger.sql`
3. Ejecuta el script completo
4. El trigger creará automáticamente el usuario actual y todos los futuros

---

## 🔧 SOLUCIÓN ALTERNATIVA 1: Corregir Políticas RLS

**Archivo**: `fix-rls-users-table.sql`

Si prefieres mantener la creación desde el cliente:
- ✅ Corrige las políticas RLS existentes
- ✅ Permite INSERT desde el cliente autenticado
- ⚠️ Requiere que el código del cliente funcione correctamente

### Pasos:
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `fix-rls-users-table.sql`
3. Ejecuta el script completo
4. Recarga la aplicación y prueba el login

---

## 🚨 SOLUCIÓN TEMPORAL: Deshabilitar RLS

**Archivos**: `temp-disable-rls.sql` + `temp-enable-rls.sql`

**⚠️ USAR SOLO COMO ÚLTIMO RECURSO**

Esta solución:
- ⚠️ Deshabilita temporalmente la seguridad
- ✅ Permite crear el usuario manualmente
- ⚠️ Requiere rehabilitar RLS después

### Pasos:
1. Ejecuta `temp-disable-rls.sql` en Supabase SQL Editor
2. Verifica que el usuario se creó correctamente
3. **INMEDIATAMENTE** ejecuta `temp-enable-rls.sql`
4. Verifica que RLS está habilitado nuevamente

---

## 📊 Verificar Estado Actual

```sql
-- Ver si RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Ver políticas activas
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'users';

-- Ver si el usuario existe
SELECT id, email, name, created_at 
FROM public.users 
WHERE id = 'fd15a329-9911-4f4c-a03e-42c941f7b14b';
```

---

## 🎯 Recomendación Final

1. **PRIMERO**: Ejecuta `create-user-trigger.sql` (solución permanente)
2. Si no funciona: Ejecuta `fix-rls-users-table.sql`
3. Como último recurso: Usa `temp-disable-rls.sql` + `temp-enable-rls.sql`

El trigger es la mejor opción porque resuelve el problema para siempre y para todos los usuarios.
