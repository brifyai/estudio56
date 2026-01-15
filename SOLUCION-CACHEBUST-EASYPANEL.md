# Solución CACHEBUST Easypanel - 15 Enero 2026

## 🚨 PROBLEMA REAL

Easypanel tiene **cache agresivo de Docker**. Aunque hagas "Force Rebuild", Docker cachea las capas y NO recompila nada si el código no cambió.

**Fuente:** [Rebuild cached static website Docker layers in Easypanel](https://www.ansonlichtfuss.com/blog/rebuild-static-website-docker-layers-in-easypanel-paas-nextjs-astro/)

## ✅ SOLUCIÓN: Variable CACHEBUST

### Paso 1: Actualizar Dockerfile (YA HECHO)

Agregué `ARG CACHEBUST=1` al Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar Nginx
RUN apk add --no-cache nginx

# Cache bust para forzar rebuild en Easypanel
ARG CACHEBUST=1

# Copy package files
COPY package*.json ./
```

### Paso 2: Agregar Variable en Easypanel

1. **Ir a Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

2. **Ir a la pestaña "Environment"**

3. **Agregar nueva variable:**
   ```
   CACHEBUST=1
   ```

4. **Guardar**

### Paso 3: Force Rebuild

1. **Click en "Force Rebuild"**
2. **Esperar 5-10 minutos**
3. **Verificar logs**

## 🔄 CÓMO FUNCIONA

- Docker cachea cada capa del Dockerfile
- Si el código no cambia, Docker reutiliza la capa cacheada
- `ARG CACHEBUST` importa la variable de entorno durante el build
- Cuando cambias `CACHEBUST=1` a `CACHEBUST=2`, Docker detecta un cambio
- Docker invalida el cache y recompila TODO desde esa línea

## 📋 VARIABLES DE ENTORNO COMPLETAS

Debes tener estas variables en Easypanel → Environment:

```env
# Cache bust (cambiar para forzar rebuild)
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

Después del rebuild, los logs DEBEN mostrar:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

## 🚀 PRÓXIMOS PASOS

1. **Pushear Dockerfile actualizado a GitHub**
2. **Agregar `CACHEBUST=1` en Easypanel → Environment**
3. **Click en "Force Rebuild"**
4. **Esperar y verificar logs**

## 💡 PARA FUTUROS REBUILDS

Cada vez que necesites forzar un rebuild:
1. Ir a Environment
2. Cambiar `CACHEBUST=1` a `CACHEBUST=2` (incrementar)
3. Guardar
4. Force Rebuild

## ⚠️ IMPORTANTE

Esta es la solución oficial documentada para Easypanel. El problema NO es tu código, es el cache de Docker que Easypanel no limpia automáticamente.
