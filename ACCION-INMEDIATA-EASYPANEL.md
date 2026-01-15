# ⚡ ACCIÓN INMEDIATA - Easypanel

## 🎯 QUÉ HACER AHORA

### OPCIÓN A: Configurar Builder (5 minutos)

1. **Ir a:** https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

2. **Pestaña "Build":**
   - Cambiar Builder a: **Dockerfile**
   - Dockerfile Path: `Dockerfile`
   - Context: `.`
   - Guardar

3. **Pestaña "Environment":**
   - Buscar `CACHEBUST`
   - Cambiar valor a: `2`
   - Guardar

4. **Click "Deploy"** (botón arriba derecha)

5. **Esperar 5-10 minutos**

6. **Verificar:**
   ```bash
   curl https://www.estudio56.cl/api/health
   ```
   Debe retornar: `{"status":"ok",...}`

---

### OPCIÓN B: Eliminar y Recrear (10 minutos)

Si Opción A no funciona:

1. **Eliminar servicio:**
   - Settings → Delete Service

2. **Crear nuevo:**
   - New Service → App
   - Source: Github
   - Repo: `brifyai/estudio56`
   - Branch: `main`
   - Builder: **Dockerfile**

3. **Agregar variables de entorno:**
   ```
   CACHEBUST=2
   NODE_ENV=production
   PORT=3000
   VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
   VITE_SUPABASE_URL=https://supabase.estudio56.cl
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
   VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
   VITE_GOOGLE_VERTEX_LOCATION=us-central1
   GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
   FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
   GOOGLE_VERTEX_PROJECT=stratega-ai-x
   GOOGLE_VERTEX_LOCATION=us-central1
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971
   MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708
   REACT_APP_SUPABASE_URL=https://supabase.estudio56.cl
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM
   REACT_APP_USE_VIDEO_WORKER=true
   REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
   SECRETS_SCAN_SMART_DETECTION_ENABLED=false
   ```

4. **Configurar Domains:**
   - Domain: `www.estudio56.cl`
   - Domain: `estudio56.cl`
   - Proxy Port: `80`

5. **Deploy**

---

### OPCIÓN C: Docker Local (15 minutos)

Si nada funciona:

```bash
# 1. Probar localmente
./scripts/test-docker-local.sh

# 2. Si funciona, subir a Docker Hub
docker build -t estudio56:latest .
docker tag estudio56:latest brifyai/estudio56:latest
docker push brifyai/estudio56:latest

# 3. En Easypanel:
# Source Type: Docker Image
# Image: brifyai/estudio56:latest
```

---

## ✅ VERIFICACIÓN

Logs deben mostrar:
```
✅ Servidor corriendo en puerto 3000
nginx/1.29.4
```

API debe responder:
```bash
curl https://www.estudio56.cl/api/health
# {"status":"ok","timestamp":"..."}
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- **Guía completa:** `GUIA-DEPLOY-EASYPANEL-FINAL.md`
- **Paso a paso interfaz:** `INSTRUCCIONES-VERIFICACION-EASYPANEL.md`
- **Resumen ejecutivo:** `RESUMEN-FINAL-DEPLOY-EASYPANEL-15-ENERO.md`

---

## 🚨 PROBLEMA RAÍZ

Easypanel está usando el builder incorrecto (Nixpacks en lugar de Dockerfile).

**Solución:** Cambiar Builder a "Dockerfile" y forzar rebuild con CACHEBUST=2.
