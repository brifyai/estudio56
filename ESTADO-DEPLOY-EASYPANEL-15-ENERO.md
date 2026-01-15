# Estado Deploy Easypanel - 15 Enero 2026

## 🔍 ANÁLISIS DEL PRIMER DEPLOY

Los logs del primer deploy muestran que:

1. ✅ **Build funcionó correctamente** - Se construyó con el Dockerfile viejo (multi-stage con nginx:alpine)
2. ✅ **Frontend se compiló** - `npm run build` completado
3. ❌ **NO hay backend Node.js** - Solo Nginx sirviendo archivos estáticos
4. ❌ **Errores 405 en /api/*** - Nginx rechaza POST porque no hay proxy

## 🚨 PROBLEMA IDENTIFICADO

El primer deploy usó un **Dockerfile viejo** que solo tenía Nginx (multi-stage build).

El Dockerfile actual (correcto) tiene:
- Node.js + Nginx en la misma imagen
- Script de inicio que arranca ambos
- Proxy configurado

**Pero Easypanel NO lo está usando.**

## ✅ SOLUCIÓN: CONFIGURAR EASYPANEL CORRECTAMENTE

### PASO 1: Verificar Source en Easypanel

1. **Ir a tu servicio en Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

2. **Ir a la pestaña "Source"**

3. **Verificar configuración:**
   ```
   Source Type: Github
   Repository: brifyai/estudio56
   Branch: main
   ```

### PASO 2: Configurar Build Method

1. **Ir a la pestaña "Build"**

2. **Seleccionar "Dockerfile"** (NO Nixpacks, NO Buildpacks)

3. **Configurar:**
   ```
   Builder: Dockerfile
   Dockerfile Path: Dockerfile
   Context: . (raíz del proyecto)
   ```

4. **Guardar cambios**

### PASO 3: Configurar Variables de Entorno

1. **Ir a la pestaña "Environment"**

2. **Agregar TODAS estas variables:**

```env
# IMPORTANTE: Cache bust
CACHEBUST=2

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

### PASO 4: Configurar Domains & Proxy

1. **Ir a la pestaña "Domains"**

2. **Verificar dominios:**
   ```
   www.estudio56.cl
   estudio56.cl
   ```

3. **IMPORTANTE: Configurar Proxy Port:**
   ```
   Port: 80
   ```
   
   **NO uses puerto 3000** - Nginx escucha en puerto 80 y hace proxy interno a Node.js:3000

### PASO 5: Deploy Settings

1. **Ir a la pestaña "Deploy"**

2. **Configurar:**
   ```
   Replicas: 1
   Command: (dejar vacío, usa CMD del Dockerfile)
   Arguments: (dejar vacío)
   ```

### PASO 6: Hacer Deploy

1. **Click en "Deploy"** (botón arriba a la derecha)

2. **Esperar 5-10 minutos** mientras construye

3. **Monitorear logs** en la pestaña "Logs"

## 🔍 LOGS CORRECTOS

Después del deploy, debes ver:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

**NO debe aparecer:**
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

## ⚠️ SI SIGUE SIN FUNCIONAR

Si después de seguir todos los pasos sigue mostrando errores 405:

### Opción A: Force Rebuild con Cache Bust

1. Cambiar variable de entorno:
   ```
   CACHEBUST=3
   ```

2. Click en "Deploy" nuevamente

### Opción B: Eliminar y Recrear Servicio

1. **Eliminar servicio actual:**
   - Settings → Delete Service

2. **Crear nuevo servicio:**
   - New Service → App
   - Source: Github → brifyai/estudio56
   - Branch: main
   - Builder: Dockerfile
   - Configurar variables de entorno
   - Deploy

## 📋 CHECKLIST

- [ ] Source configurado (Github, branch main)
- [ ] Build method = Dockerfile
- [ ] Variables de entorno agregadas (25 variables)
- [ ] Proxy port = 80
- [ ] Deploy ejecutado
- [ ] Logs muestran Node.js + Nginx
- [ ] API responde en /api/health
- [ ] NO hay errores 405

## 🎯 RESUMEN

El problema NO es el código. El Dockerfile está perfecto.

El problema es la **configuración en Easypanel**.

Necesitas:
1. Asegurar que usa el builder "Dockerfile"
2. Configurar todas las variables de entorno
3. Configurar proxy port = 80
4. Hacer deploy limpio

Si sigues estos pasos, debería funcionar.
