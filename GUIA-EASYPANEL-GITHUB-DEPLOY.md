# GUÍA: Deploy en Easypanel usando GitHub

## PASO 1: Eliminar el servicio actual
1. En Easypanel, ve a tu proyecto `estudio56v2`
2. Elimina el servicio `estudio56v22` actual (botón de basura)
3. Confirma la eliminación

## PASO 2: Crear nuevo servicio desde GitHub
1. Haz clic en **"+ Service"**
2. Selecciona **"GitHub"** (NO Dockerfile)
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio: `brifyai/estudio56`
5. Branch: `main`

## PASO 3: Configurar Build Settings
Easypanel debería detectar automáticamente que es un proyecto Node.js/Vite.

Si no lo detecta, configura manualmente:
- **Build Command**: `npm ci && npm run build`
- **Start Command**: Deja vacío (usaremos nginx)
- **Install Command**: `npm ci`
- **Output Directory**: `dist`

## PASO 4: Agregar Variables de Entorno
En la sección "Environment Variables", agrega:

```
VITE_GEMINI_API_KEY=AIzaSyCjYfdiXyAJHHhpNn2FnSiZSA-xn5oqeLU
VITE_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw
REACT_APP_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
```

## PASO 5: Configurar Puerto y Dominio
1. **Port**: 80 (para nginx)
2. **Domain**: Configura tu dominio personalizado si lo tienes

## PASO 6: Deploy
1. Haz clic en **"Deploy"**
2. Espera a que termine el build (puede tomar 3-5 minutos)
3. Verifica los logs para confirmar que el build fue exitoso

## PASO 7: Verificar
1. Abre la URL de tu servicio
2. Verifica que NO aparezca el error de Supabase
3. Prueba que el sitio funcione correctamente

## ALTERNATIVA: Si GitHub no funciona

Si Easypanel no puede conectarse a GitHub o el build falla, usa el método de **Upload**:

1. En tu máquina local, ejecuta:
   ```bash
   npm run build
   ```

2. Comprime la carpeta `dist`:
   ```bash
   cd dist
   zip -r ../dist.zip .
   cd ..
   ```

3. En Easypanel:
   - Selecciona **"Upload"** como source
   - Sube el archivo `dist.zip`
   - Configura nginx para servir archivos estáticos

## NOTAS IMPORTANTES
- Easypanel con GitHub es más fácil que con Dockerfile
- El build se hace automáticamente en cada push a GitHub
- Las variables de entorno se inyectan durante el build
- No necesitas el Dockerfile si usas GitHub

## TROUBLESHOOTING
Si el build falla:
1. Revisa los logs de build en Easypanel
2. Verifica que las variables de entorno estén configuradas
3. Confirma que el comando de build sea correcto
4. Asegúrate de que `package.json` tenga el script `build`
