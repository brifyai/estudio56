# DEPLOY EASYPANEL - INSTRUCCIONES FINALES

## ✅ CONFIGURACIÓN COMPLETADA

Todas las variables de entorno están actualizadas:
- ✅ Supabase self-hosted: `https://estudio56supabase.brifyai.com`
- ✅ Gemini API Key
- ✅ FAL AI API Key
- ✅ MercadoPago Keys
- ✅ Vertex AI Configuration
- ✅ Cloudflare Worker URL

## PASOS PARA COMPLETAR EL DEPLOY

### PASO 1: En Easypanel - Confirmar Dockerfile
1. Ve a tu proyecto en Easypanel
2. En la sección **Deploy**, verifica:
   - Build Method: **Dockerfile** ✓
   - File: **Dockerfile** ✓
3. Haz clic en **"Save"** para confirmar
4. Espera a que termine el build (5-10 minutos)

### PASO 2: Verificar que la App Funciona
Una vez que el build termine:
1. Accede a tu dominio de Easypanel
2. Verifica que:
   - La app carga correctamente
   - El logo tiene texto blanco ✓
   - Los botones funcionan
   - Puedes hacer login con Supabase

### PASO 3: Redeploy en Netlify (para CORS)
1. Ve a Netlify
2. Haz clic en **"Trigger deploy"** o espera a que se redeploy automáticamente
3. Esto aplicará los headers CORS que necesitan las Netlify Functions

### PASO 4: Probar Análisis de URLs desde Easypanel
1. Abre tu app en Easypanel
2. Ve a modo **"Canva"**
3. Pega una URL (ej: https://www.instagram.com/tuempresa)
4. Haz clic en **"Analizar"**
5. Verifica que funcione sin errores CORS

## VARIABLES DE ENTORNO POR UBICACIÓN

### Frontend (Easypanel - en Dockerfile)
```
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://estudio56supabase.brifyai.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1
FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708
```

### Backend (Netlify Functions)
Estas variables ya están en Netlify:
- VITE_GOOGLE_VERTEX_PROJECT
- VITE_GOOGLE_VERTEX_LOCATION
- GOOGLE_APPLICATION_CREDENTIALS
- MERCADOPAGO_ACCESS_TOKEN
- SUPABASE_SERVICE_ROLE_KEY

## ARQUITECTURA FINAL

```
┌─────────────────────────────────────────────────────────┐
│                    EASYPANEL (Frontend)                 │
│              React App + Nginx (Puerto 80)              │
│         URL: https://estudio56supabase.brifyai.com      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ├─→ Supabase Self-Hosted (Easypanel)
                         │   https://estudio56supabase.brifyai.com
                         │
                         ├─→ Netlify Functions (Backend)
                         │   ├─ Análisis de URLs (Vertex AI)
                         │   ├─ Generación de Imágenes (FAL AI)
                         │   ├─ Pagos (MercadoPago)
                         │   └─ Webhooks
                         │
                         ├─→ Cloudflare Worker
                         │   └─ Generación de Videos
                         │
                         └─→ APIs Externas
                             ├─ Vertex AI (Google)
                             ├─ FAL AI
                             ├─ MercadoPago
                             └─ Cloudflare
```

## TROUBLESHOOTING

### Error CORS en Análisis de URLs
**Síntoma**: Error 403 o "No 'Access-Control-Allow-Origin' header"

**Solución**:
1. Verifica que `netlify.toml` tenga los headers CORS ✓
2. Haz un redeploy en Netlify
3. Espera 2-3 minutos
4. Intenta de nuevo desde Easypanel

### App no carga en Easypanel
**Síntoma**: Página en blanco o error 404

**Solución**:
1. Verifica que el build en Easypanel terminó exitosamente
2. Revisa los logs en Easypanel
3. Verifica que el Dockerfile sea correcto
4. Intenta un rebuild forzado en Easypanel

### Supabase no conecta
**Síntoma**: Error de autenticación o conexión

**Solución**:
1. Verifica que la URL sea: `https://estudio56supabase.brifyai.com`
2. Verifica que la Anon Key sea correcta
3. Verifica que Supabase esté corriendo en Easypanel
4. Intenta acceder directamente a la URL de Supabase

### Logo sin color blanco
**Síntoma**: El texto "Mi Marca" aparece en otro color

**Solución**:
- Ya está implementado en BrandPreview.tsx
- Limpia cache del navegador (Ctrl+Shift+Delete)
- Recarga la página

## PRÓXIMOS PASOS

1. ✅ Confirmar Dockerfile en Easypanel
2. ✅ Esperar build (5-10 minutos)
3. ✅ Verificar que la app funciona
4. ✅ Redeploy en Netlify
5. ✅ Probar análisis de URLs desde Easypanel
6. ✅ Probar login con Supabase
7. ✅ Probar generación de imágenes
8. ✅ Probar generación de videos

## CAMBIOS REALIZADOS

- ✅ Actualizado Dockerfile con variables de Supabase self-hosted
- ✅ Actualizado .env.local con todas las variables
- ✅ Agregados headers CORS en netlify.toml
- ✅ Commiteado y pusheado a GitHub

## NOTAS IMPORTANTES

- El Dockerfile contiene todas las variables necesarias para el build
- `.env.local` es solo para desarrollo local (no se sube a Git)
- Las Netlify Functions siguen en Netlify (no se migran a Easypanel)
- Supabase self-hosted está en Easypanel
- El frontend React está en Easypanel
- Todo está conectado y listo para funcionar
