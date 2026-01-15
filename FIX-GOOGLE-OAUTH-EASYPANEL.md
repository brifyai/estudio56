# FIX GOOGLE OAUTH - EASYPANEL

## PROBLEMA

Error al iniciar sesión con Google:
```
No se puede acceder a este sitio
placeholder.supabase.co
DNS_PROBE_FINISHED_NXDOMAIN
```

## CAUSA

La variable `VITE_SUPABASE_URL` NO está configurada en Easypanel. El código está usando el valor placeholder por defecto.

## SOLUCIÓN

### PASO 1: Configurar Variables en Easypanel

Ve a Easypanel → Tu Proyecto → **Environment**

Agrega estas variables (CRÍTICAS para OAuth):

```
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

**IMPORTANTE**: Estas variables deben estar en **Environment** de Easypanel, NO solo en el Dockerfile.

### PASO 2: Rebuild

Después de agregar las variables:
1. Click en **Rebuild**
2. Esperar 3-5 minutos
3. Probar login con Google

---

## VARIABLES COMPLETAS PARA EASYPANEL

Copia y pega estas en Easypanel → Environment:

### Frontend (Build Time - CRÍTICAS)
```
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1
```

### Backend (Runtime)
```
NODE_ENV=production
PORT=80
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM
GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971
MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708
GOOGLE_VERTEX_PROJECT=stratega-ai-x
GOOGLE_VERTEX_LOCATION=us-central1
```

---

## CONFIGURAR GOOGLE OAUTH

Después de que funcione Supabase, configura Google OAuth:

### Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto
3. Click en tu OAuth 2.0 Client ID
4. Agrega estos dominios:

**Orígenes autorizados de JavaScript:**
```
https://www.estudio56.cl
https://estudio56.cl
https://supabase.estudio56.cl
```

**URIs de redireccionamiento autorizados:**
```
https://supabase.estudio56.cl/auth/v1/callback
```

5. Click en **Guardar**

---

## VERIFICACIÓN

### 1. Verificar Variables en Build
Después del rebuild, busca en los logs:
```
VITE_SUPABASE_URL=https://supabase.estudio56.cl
```

Si NO aparece, las variables NO están configuradas correctamente.

### 2. Verificar en Navegador
1. Abre `https://www.estudio56.cl`
2. Abre DevTools (F12) → Console
3. Escribe: `import.meta.env.VITE_SUPABASE_URL`
4. Debe mostrar: `https://supabase.estudio56.cl`

Si muestra `placeholder.supabase.co`, el build NO tiene las variables.

### 3. Probar Login
1. Click en "Iniciar sesión con Google"
2. Debe redirigir a Google (NO a placeholder.supabase.co)
3. Después de autorizar, debe volver a tu app

---

## TROUBLESHOOTING

### Error: "placeholder.supabase.co"
**Causa**: Variables NO configuradas en Easypanel Environment
**Solución**: Agregar variables en Easypanel → Environment → Rebuild

### Error: "redirect_uri_mismatch"
**Causa**: Google OAuth no tiene el dominio configurado
**Solución**: Agregar `https://supabase.estudio56.cl/auth/v1/callback` en Google Console

### Error: "Invalid API key"
**Causa**: `VITE_SUPABASE_ANON_KEY` incorrecta
**Solución**: Verificar que la key es la correcta de tu Supabase self-hosted

---

## NOTAS IMPORTANTES

1. **Variables VITE_* son BUILD TIME**: Deben estar configuradas ANTES del build
2. **Easypanel NO lee .env del repo**: Debes configurar en Environment
3. **Rebuild es necesario**: Cambios en variables requieren rebuild completo
4. **Supabase self-hosted**: URL es `https://supabase.estudio56.cl` (NO brifyai.com)

---

## RESUMEN

1. ✅ Agregar variables en Easypanel → Environment
2. ✅ Rebuild
3. ✅ Configurar Google OAuth con dominios correctos
4. ✅ Probar login

**TIEMPO ESTIMADO**: 5 minutos
