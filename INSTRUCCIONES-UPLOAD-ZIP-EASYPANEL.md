# Instrucciones Upload ZIP a Easypanel - 15 Enero 2026

## 🎯 OBJETIVO

Subir el código actualizado a Easypanel usando un archivo ZIP, ya que el deploy desde GitHub no está funcionando correctamente.

## 📦 PASO 1: Generar ZIP Actualizado

Ejecuta este comando en la raíz del proyecto:

```bash
zip -r estudio56-deploy-$(date +%Y%m%d-%H%M%S).zip . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "*.zip" \
  -x "*.pdf" \
  -x ".DS_Store" \
  -x ".env" \
  -x ".env.local" \
  -x "*.md"
```

Esto creará un archivo como: `estudio56-deploy-20260115-143022.zip`

## 🚀 PASO 2: Subir a Easypanel

### Opción A: Si Easypanel soporta Upload ZIP

1. **Ir a Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`

2. **Buscar opción de Upload:**
   - Puede estar en "New Service"
   - O en "Source" del servicio existente
   - Buscar "Upload ZIP", "From Archive", o "Manual Upload"

3. **Subir el ZIP y configurar:**
   - Builder: Dockerfile
   - Variables de entorno (ver abajo)
   - Deploy

### Opción B: Si NO hay opción de Upload ZIP

Easypanel puede no soportar upload directo de ZIP. En ese caso:

1. **Verificar que GitHub está conectado correctamente**
2. **Forzar pull del código nuevo**
3. **Rebuild con cache bust**

## 🔧 PASO 3: Configurar Variables de Entorno

Después de subir el ZIP, agregar estas variables:

```env
CACHEBUST=2
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

## 🔍 PASO 4: Verificar Deploy

Después del deploy, verificar logs:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
nginx/1.29.4
```

## 🧪 PASO 5: Probar API

```bash
curl https://www.estudio56.cl/api/health
```

Debe retornar:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

## ⚠️ ALTERNATIVA: Deploy Manual con Docker

Si Easypanel no soporta upload de ZIP, puedes construir la imagen localmente y subirla:

```bash
# 1. Construir imagen localmente
docker build -t estudio56:latest .

# 2. Probar localmente
docker run -p 80:80 \
  -e VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw \
  -e VITE_SUPABASE_URL=https://supabase.estudio56.cl \
  estudio56:latest

# 3. Verificar que funciona
curl http://localhost/api/health

# 4. Si funciona, subir a registry y usar en Easypanel
```

## 📋 RESUMEN

1. Generar ZIP con código actualizado
2. Subir a Easypanel (si soporta)
3. Configurar variables de entorno
4. Deploy
5. Verificar logs y API

Si Easypanel NO soporta upload de ZIP, necesitas:
- Asegurar que GitHub está conectado
- Forzar rebuild con CACHEBUST=2
- O construir imagen Docker localmente
