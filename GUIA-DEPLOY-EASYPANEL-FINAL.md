# GUÍA DEPLOY EASYPANEL - PASO A PASO

## ESTADO ACTUAL
- ✅ Dockerfile configurado correctamente
- ✅ Variables de entorno en `.env.local` listas
- ✅ Netlify Functions configuradas (análisis de URLs con Vertex AI)
- ✅ Color blanco del logo implementado en BrandPreview.tsx

## PASOS PARA COMPLETAR EL DEPLOY

### PASO 1: Confirmar Dockerfile en Easypanel
1. En Easypanel, en la sección "Deploy", verifica que:
   - **Build Method**: Dockerfile ✓
   - **File**: Dockerfile ✓
2. Haz clic en **"Save"** para confirmar

### PASO 2: Esperar Build
- El build tardará 5-10 minutos
- Easypanel compilará la app y la servirá en tu dominio

### PASO 3: Verificar que la App Funciona
- Accede a tu dominio de Easypanel
- Verifica que:
  - La app carga correctamente
  - El logo tiene texto blanco ✓
  - Los botones funcionan

### PASO 4: Configurar CORS para Netlify Functions
Las Netlify Functions necesitan CORS headers para funcionar desde Easypanel.

**Opción A: Actualizar netlify.toml (RECOMENDADO)**

Agregar headers CORS al archivo `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build]
  command = "npm run build"
  publish = "dist"

[functions]
  node_bundler = "esbuild"

[functions.generate-image]
  timeout = 26

[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
```

### PASO 5: Push a GitHub
```bash
git add netlify.toml
git commit -m "fix: agregar CORS headers para Easypanel"
git push origin main
```

### PASO 6: Redeploy en Netlify
- Ve a Netlify
- Haz clic en "Trigger deploy" o espera a que se redeploy automáticamente
- Espera a que termine el build

### PASO 7: Probar Análisis de URLs desde Easypanel
1. Abre tu app en Easypanel
2. Ve a modo "Canva"
3. Pega una URL (ej: https://www.instagram.com/tuempresa)
4. Haz clic en "Analizar"
5. Verifica que funcione sin errores CORS

## TROUBLESHOOTING

### Error CORS en Análisis de URLs
**Síntoma**: Error 403 o "No 'Access-Control-Allow-Origin' header"

**Solución**:
1. Verifica que `netlify.toml` tenga los headers CORS
2. Haz push a GitHub
3. Redeploy en Netlify
4. Espera 2-3 minutos
5. Intenta de nuevo desde Easypanel

### App no carga en Easypanel
**Síntoma**: Página en blanco o error 404

**Solución**:
1. Verifica que el build en Easypanel terminó exitosamente
2. Revisa los logs en Easypanel
3. Verifica que el Dockerfile sea correcto
4. Intenta un rebuild forzado en Easypanel

### Logo sin color blanco
**Síntoma**: El texto "Mi Marca" aparece en otro color

**Solución**:
- Ya está implementado en BrandPreview.tsx
- Limpia cache del navegador (Ctrl+Shift+Delete)
- Recarga la página

## VARIABLES DE ENTORNO NECESARIAS

### En Easypanel (Frontend)
Estas están en el Dockerfile:
- VITE_GEMINI_API_KEY
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- REACT_APP_VIDEO_WORKER_URL

### En Netlify (Backend)
Estas están en Netlify:
- VITE_GOOGLE_VERTEX_PROJECT
- VITE_GOOGLE_VERTEX_LOCATION
- GOOGLE_APPLICATION_CREDENTIALS

## ARQUITECTURA FINAL
```
Easypanel (Frontend React)
    ↓
Netlify Functions (Backend)
    ↓
Vertex AI (Análisis de URLs)
Cloudflare Worker (Generación de Videos)
FAL AI (Generación de Imágenes)
```

## PRÓXIMOS PASOS
1. ✅ Confirmar Dockerfile en Easypanel
2. ✅ Esperar build
3. ✅ Actualizar netlify.toml con CORS
4. ✅ Push a GitHub
5. ✅ Redeploy en Netlify
6. ✅ Probar análisis de URLs desde Easypanel
