# Configuración de URLs en Supabase para Netlify

## 1. Configurar URLs de Autenticación (Redirect URLs)

En Supabase, ve a: **Authentication** → **URL Configuration**

Agrega las siguientes URLs en **Site URL** y **Redirect URLs**:

### Para desarrollo local:
```
http://localhost:3000
http://localhost:3000/auth/callback
```

### Para producción Netlify (agrega TUS URLs):
```
https://tu-sitio.netlify.app
https://tu-sitio.netlify.app/auth/callback
```

## 2. Configurar CORS (si es necesario)

Si tienes problemas de CORS, ve a **API** → **CORS**

Agrega:
```
https://tu-sitio.netlify.app
http://localhost:3000
```

## 3. Configurar Row Level Security (RLS)

Asegúrate de que las tablas tengan políticas RLS correctas. Las tablas principales son:

### Tabla `users`
- Los usuarios pueden ver y editar solo sus propios datos
- Policy: `Users can view own data`
- Policy: `Users can update own data`

### Tabla `brands`
- Los usuarios pueden ver y editar solo sus propias marcas
- Policy: `Users can view own brands`
- Policy: `Users can insert own brands`
- Policy: `Users can update own brands`
- Policy: `Users can delete own brands`

### Tabla `flyer_generations`
- Los usuarios pueden ver y editar solo sus propias generaciones
- Policy: `Users can view own generations`
- Policy: `Users can insert own generations`
- Policy: `Users can update own generations`
- Policy: `Users can delete own generations`

## 4. Verificar configuración de Supabase

Ejecuta el script de verificación:
```bash
node scripts/verify-auth.js
```

## 5. URLs de tu proyecto Supabase

- **URL del proyecto:** `https://zskunemvffyqyxtfqyzm.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/zskunemvffyqyxtfqyzm`

## 6. Pasos para conectar Netlify

1. Ve a **Site Settings** → **Environment variables**
2. Agrega las variables del archivo `NETLIFY_ENV_VARS.md`
3. Ve a **Deploys** → **Trigger deploy** → **Deploy site**
4. Verifica que funcione la autenticación