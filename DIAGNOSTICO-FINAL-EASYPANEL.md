# Diagnóstico Final Easypanel - 15 Enero 2026

## 🚨 CONFIRMADO: DOCKERFILE VIEJO

Los logs confirman que Easypanel está usando el **Dockerfile VIEJO** (solo Nginx):

```
/docker-entrypoint.sh: Configuration complete; ready for start up
2026/01/15 19:36:01 [notice] 1#1: nginx/1.29.4
```

**Esto es el entrypoint de `nginx:alpine`**, NO el Dockerfile nuevo.

## ❌ EVIDENCIA: NO HAY BACKEND

Los logs muestran errores 405 (Method Not Allowed):

```
"POST /api HTTP/1.1" 405 157
"POST /graphql HTTP/1.1" 405 157
```

**405 = Nginx rechaza POST porque NO hay proxy a Node.js**

## 🔍 QUÉ ESTÁ PASANDO

1. **Easypanel NO está conectado a GitHub automáticamente**
2. **Easypanel está usando código viejo cacheado**
3. **Force Rebuild NO funciona** porque usa el mismo código viejo

## ✅ SOLUCIÓN ÚNICA QUE FUNCIONA

### Opción 1: Subir ZIP Manualmente (GARANTIZADO)

1. **Descargar ZIP de GitHub:**
   ```bash
   # Ir a: https://github.com/brifyai/estudio56
   # Click en "Code" → "Download ZIP"
   # O usar el ZIP que ya creé: estudio56-deploy.zip
   ```

2. **Ir a Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

3. **Eliminar servicio actual:**
   - Settings → Delete Service
   - Confirmar eliminación

4. **Crear nuevo servicio:**
   - Click en "New Service"
   - Seleccionar "From ZIP" o "Upload Archive"
   - Subir `estudio56-deploy.zip`
   - Configurar variables de entorno (ver abajo)
   - Deploy

### Opción 2: Conectar GitHub (RECOMENDADO LARGO PLAZO)

1. **En Easypanel → Servicio → Settings**

2. **Buscar "Source" o "Git Repository"**

3. **Conectar GitHub:**
   - Repository: `https://github.com/brifyai/estudio56`
   - Branch: `main`
   - Dockerfile path: `Dockerfile`

4. **Guardar y hacer Deploy**

## 📋 VARIABLES DE ENTORNO REQUERIDAS

Después de crear el servicio, agregar estas variables en Environment:

```env
# Cache bust (IMPORTANTE)
CACHEBUST=1

# Frontend
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1

# Backend
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
GOOGLE_VERTEX_PROJECT=stratega-ai-x
GOOGLE_VERTEX_LOCATION=us-central1

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971
MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708

# Supabase
REACT_APP_SUPABASE_URL=https://supabase.estudio56.cl
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM

# Video Worker
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev

# Seguridad
SECRETS_SCAN_SMART_DETECTION_ENABLED=false
```

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

Los logs DEBEN mostrar:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

**NO debe mostrar:**
```
/docker-entrypoint.sh: Configuration complete
```

## 🧪 PRUEBA FINAL

```bash
curl https://www.estudio56.cl/api/health
```

Debe retornar:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

**NO debe retornar 405**

## ⚠️ POR QUÉ FORCE REBUILD NO FUNCIONA

Easypanel tiene 3 niveles de cache:
1. **Código fuente** - Usa commit viejo
2. **Capas Docker** - Usa capas cacheadas
3. **Imagen final** - Usa imagen vieja

**Force Rebuild solo limpia cache de Docker, NO actualiza el código fuente.**

## 🚀 RESUMEN

1. **Eliminar servicio actual**
2. **Crear nuevo servicio desde ZIP o GitHub**
3. **Configurar variables de entorno**
4. **Deploy**
5. **Verificar logs muestran Node.js + Nginx**
6. **Probar API**

Esto es la ÚNICA forma de forzar a Easypanel a usar el código nuevo.
