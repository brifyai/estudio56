# Pasos Finales Producción Easypanel - 15 Enero 2026

## 🎯 PROBLEMA ACTUAL

El primer deploy mostró que Easypanel construyó con un Dockerfile viejo. Los logs confirman:
- ✅ Build completado
- ❌ Solo Nginx (sin Node.js backend)
- ❌ Errores 405 en /api/*

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Verificar Configuración en Easypanel

1. **Ir a tu servicio:**
   - https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

2. **Ir a pestaña "Build"**

3. **IMPORTANTE: Seleccionar "Dockerfile"**
   - NO uses Nixpacks
   - NO uses Buildpacks
   - Debe decir: **Builder: Dockerfile**

4. **Configurar:**
   ```
   Dockerfile Path: Dockerfile
   Context: .
   ```

5. **Guardar cambios**

### PASO 2: Actualizar CACHEBUST

Para forzar rebuild completo:

1. **Ir a pestaña "Environment"**

2. **Buscar variable `CACHEBUST`**

3. **Cambiar valor:**
   ```
   CACHEBUST=2
   ```
   
   (Si no existe, agregarla)

4. **Guardar**

### PASO 3: Configurar Proxy Port

1. **Ir a pestaña "Domains"**

2. **Verificar "Proxy Port":**
   ```
   Port: 80
   ```
   
   **NO 3000** - Nginx escucha en 80 y hace proxy interno a Node.js:3000

3. **Guardar**

### PASO 4: Deploy

1. **Click en botón "Deploy"** (arriba a la derecha)

2. **Esperar 5-10 minutos**

3. **Monitorear logs en pestaña "Logs"**

### PASO 5: Verificar Logs

Los logs DEBEN mostrar:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

**Si ves esto, significa que NO funcionó:**
```
/docker-entrypoint.sh: Configuration complete
```

### PASO 6: Probar API

```bash
curl https://www.estudio56.cl/api/health
```

Debe retornar:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

## 🚨 SI SIGUE SIN FUNCIONAR

### Opción A: Eliminar y Recrear Servicio

Según la documentación de Easypanel, a veces es necesario recrear el servicio:

1. **Eliminar servicio actual:**
   - Settings → Delete Service
   - Confirmar

2. **Crear nuevo servicio:**
   - Click "New Service"
   - Tipo: **App**
   - Source: **Github**
   - Repository: `brifyai/estudio56`
   - Branch: `main`

3. **Configurar Build:**
   - Builder: **Dockerfile**
   - Dockerfile Path: `Dockerfile`
   - Context: `.`

4. **Agregar variables de entorno** (ver lista completa abajo)

5. **Configurar Domains:**
   - Domain: `www.estudio56.cl`
   - Domain: `estudio56.cl`
   - Proxy Port: `80`

6. **Deploy**

### Opción B: Usar Docker Image Directo

Si GitHub sigue sin funcionar, puedes construir la imagen localmente:

1. **Construir imagen:**
   ```bash
   docker build -t estudio56:latest .
   ```

2. **Probar localmente:**
   ```bash
   docker run -p 80:80 \
     -e VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw \
     -e VITE_SUPABASE_URL=https://supabase.estudio56.cl \
     -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE \
     estudio56:latest
   ```

3. **Verificar:**
   ```bash
   curl http://localhost/api/health
   ```

4. **Si funciona, subir a Docker Hub:**
   ```bash
   docker tag estudio56:latest tuusuario/estudio56:latest
   docker push tuusuario/estudio56:latest
   ```

5. **En Easypanel:**
   - Source Type: **Docker Image**
   - Image: `tuusuario/estudio56:latest`
   - Deploy

## 📋 VARIABLES DE ENTORNO COMPLETAS

```env
# Cache bust
CACHEBUST=2

# Node
NODE_ENV=production
PORT=3000

# Frontend
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1

# Backend
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

## 🎯 CHECKLIST FINAL

- [ ] Builder configurado como "Dockerfile"
- [ ] CACHEBUST=2 en variables de entorno
- [ ] Proxy Port = 80
- [ ] Deploy ejecutado
- [ ] Logs muestran "Servidor corriendo en puerto 3000"
- [ ] Logs muestran "nginx/1.29.4"
- [ ] NO aparece "/docker-entrypoint.sh"
- [ ] API responde en /api/health
- [ ] NO hay errores 405

## 🚀 RESUMEN

**El código está correcto.** El problema es la configuración en Easypanel.

**Pasos críticos:**
1. Builder = Dockerfile (NO Nixpacks)
2. CACHEBUST=2 para forzar rebuild
3. Proxy Port = 80
4. Si no funciona, eliminar y recrear servicio

**Si nada funciona:**
- Construir imagen Docker localmente
- Probar que funciona
- Subir a Docker Hub
- Usar Docker Image en Easypanel
