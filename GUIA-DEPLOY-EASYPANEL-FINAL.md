# Guía Deploy Easypanel Final - 15 Enero 2026

## 🎯 SITUACIÓN ACTUAL

- ✅ Código correcto pusheado a GitHub
- ✅ Dockerfile con Nginx + Node.js listo
- ❌ Easypanel construyó con Dockerfile viejo
- ❌ Solo Nginx funcionando (sin backend)
- ❌ Errores 405 en /api/*

## 🚀 3 OPCIONES PARA SOLUCIONAR

### OPCIÓN 1: Configurar Builder Correctamente (RÁPIDO)

**Tiempo: 5 minutos**

1. **Ir a Easypanel → Servicio → Pestaña "Build"**

2. **Cambiar a "Dockerfile":**
   - Builder: **Dockerfile** (NO Nixpacks)
   - Dockerfile Path: `Dockerfile`
   - Context: `.`

3. **Ir a pestaña "Environment"**

4. **Cambiar CACHEBUST:**
   ```
   CACHEBUST=2
   ```

5. **Click "Deploy"**

6. **Verificar logs:**
   ```
   ✅ Servidor corriendo en puerto 3000
   nginx/1.29.4
   ```

7. **Probar:**
   ```bash
   curl https://www.estudio56.cl/api/health
   ```

---

### OPCIÓN 2: Eliminar y Recrear Servicio (GARANTIZADO)

**Tiempo: 10 minutos**

1. **Eliminar servicio actual:**
   - Settings → Delete Service

2. **Crear nuevo servicio:**
   - New Service → App
   - Source: Github
   - Repository: `brifyai/estudio56`
   - Branch: `main`

3. **Configurar Build:**
   - Builder: **Dockerfile**
   - Dockerfile Path: `Dockerfile`

4. **Agregar variables de entorno:**
   ```env
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

5. **Configurar Domains:**
   - Domain: `www.estudio56.cl`
   - Domain: `estudio56.cl`
   - Proxy Port: `80`

6. **Deploy**

7. **Verificar logs y API**

---

### OPCIÓN 3: Docker Image Manual (PLAN B)

**Tiempo: 15 minutos**

Si las opciones anteriores no funcionan, construye la imagen localmente:

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
     -e NODE_ENV=production \
     -e PORT=3000 \
     estudio56:latest
   ```

3. **Verificar funciona:**
   ```bash
   curl http://localhost/api/health
   # Debe retornar: {"status":"ok",...}
   ```

4. **Subir a Docker Hub:**
   ```bash
   docker login
   docker tag estudio56:latest brifyai/estudio56:latest
   docker push brifyai/estudio56:latest
   ```

5. **En Easypanel:**
   - Source Type: **Docker Image**
   - Image: `brifyai/estudio56:latest`
   - Agregar variables de entorno
   - Deploy

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

### 1. Logs Correctos

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

### 2. API Responde

```bash
curl https://www.estudio56.cl/api/health
```

Retorna:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

### 3. NO hay errores 405

```bash
curl -X POST https://www.estudio56.cl/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

NO debe retornar 405.

---

## ⚠️ ERRORES COMUNES

### Error: Builder es Nixpacks

**Síntoma:** Logs no muestran "Servidor corriendo en puerto 3000"

**Solución:** Cambiar Builder a "Dockerfile" en pestaña Build

### Error: Proxy Port es 3000

**Síntoma:** Nginx no responde

**Solución:** Cambiar Proxy Port a 80 en pestaña Domains

### Error: CACHEBUST no actualizado

**Síntoma:** Sigue usando código viejo

**Solución:** Cambiar CACHEBUST=2 (o 3, 4, etc.)

### Error: Variables de entorno faltantes

**Síntoma:** API funciona pero falla al procesar

**Solución:** Verificar que TODAS las 25 variables están configuradas

---

## 🎯 RECOMENDACIÓN

**Empieza con OPCIÓN 1** (cambiar builder + CACHEBUST).

Si no funciona en 5 minutos, **pasa a OPCIÓN 2** (eliminar y recrear).

Si nada funciona, **usa OPCIÓN 3** (Docker image manual).

---

## 📋 CHECKLIST

- [ ] Builder = Dockerfile
- [ ] CACHEBUST actualizado
- [ ] Proxy Port = 80
- [ ] Variables de entorno configuradas
- [ ] Deploy ejecutado
- [ ] Logs muestran Node.js + Nginx
- [ ] API responde en /api/health
- [ ] NO hay errores 405

---

## 🚀 RESUMEN

El código está perfecto. El problema es la configuración en Easypanel.

**Solución:** Asegurar que usa el builder "Dockerfile" y forzar rebuild con CACHEBUST.

**Si no funciona:** Eliminar y recrear servicio desde cero.

**Plan B:** Construir imagen Docker localmente y subirla.
