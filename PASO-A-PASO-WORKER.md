# 🎯 Paso a Paso: Deploy Cloudflare Worker

**Tiempo estimado**: 15 minutos  
**Dificultad**: Fácil  
**Requisitos**: Cuenta de Cloudflare (gratis)

---

## 📋 Checklist Rápido

```
[ ] Paso 1: Instalar Wrangler (2 min)
[ ] Paso 2: Login a Cloudflare (1 min)
[ ] Paso 3: Configurar API Key (2 min)
[ ] Paso 4: Deploy Worker (3 min)
[ ] Paso 5: Configurar React App (2 min)
[ ] Paso 6: Test (3 min)
[ ] Paso 7: Deploy a producción (2 min)
```

---

## 🚀 Paso 1: Instalar Wrangler (2 min)

### Comando:
```bash
npm install -g wrangler
```

### Verificar:
```bash
wrangler --version
```

### Output esperado:
```
⛅️ wrangler 3.x.x
```

### ✅ Listo cuando:
- Ves la versión de wrangler

---

## 🔐 Paso 2: Login a Cloudflare (1 min)

### Comando:
```bash
wrangler login
```

### Qué pasa:
1. Se abre tu navegador
2. Te pide autorizar Wrangler
3. Click "Allow"
4. Vuelve a la terminal

### Output esperado:
```
Successfully logged in.
```

### ✅ Listo cuando:
- Ves "Successfully logged in"

### ⚠️ Si no tienes cuenta:
1. Ir a https://dash.cloudflare.com/sign-up
2. Crear cuenta gratis
3. Volver a `wrangler login`

---

## 🔑 Paso 3: Configurar API Key (2 min)

### Comando:
```bash
cd cloudflare-workers
wrangler secret put FAL_AI_API_KEY
```

### Qué pasa:
1. Te pide la API Key
2. Pegar tu API Key de fal.ai
3. Enter

### Dónde está tu API Key:
- En tu archivo `.env.local`
- Variable: `VITE_FAL_AI_API_KEY`
- O en Netlify: Site settings → Environment variables

### Output esperado:
```
🌀 Creating the secret for the Worker "estudio56-video-worker"
✨ Success! Uploaded secret FAL_AI_API_KEY
```

### Verificar:
```bash
wrangler secret list
```

### Output esperado:
```
[
  {
    "name": "FAL_AI_API_KEY",
    "type": "secret_text"
  }
]
```

### ✅ Listo cuando:
- Ves "Success! Uploaded secret"
- `wrangler secret list` muestra FAL_AI_API_KEY

---

## 🚀 Paso 4: Deploy Worker (3 min)

### Comando:
```bash
cd cloudflare-workers
wrangler deploy
```

### Qué pasa:
1. Wrangler sube el código
2. Cloudflare lo despliega globalmente
3. Te da una URL

### Output esperado:
```
⛅️ wrangler 3.x.x
------------------
Total Upload: xx.xx KiB / gzip: xx.xx KiB
Uploaded estudio56-video-worker (x.xx sec)
Published estudio56-video-worker (x.xx sec)
  https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
Current Deployment ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 📝 IMPORTANTE:
**Copia esta URL**: `https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev`

La necesitarás en el siguiente paso.

### ✅ Listo cuando:
- Ves "Published estudio56-video-worker"
- Tienes la URL copiada

---

## ⚙️ Paso 5: Configurar React App (2 min)

### Editar `.env.local`:

```bash
# Agregar estas líneas al final del archivo

# Habilitar Cloudflare Worker
REACT_APP_USE_VIDEO_WORKER=true

# URL del Worker (reemplazar con tu URL del paso 4)
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

### Ejemplo completo:
```bash
# ... tus otras variables ...

# Cloudflare Worker para videos
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.abc123.workers.dev
```

### ✅ Listo cuando:
- Archivo `.env.local` tiene las 2 nuevas variables
- URL es la correcta (la del paso 4)

---

## 🧪 Paso 6: Test (3 min)

### Test 1: Health Check

```bash
curl https://TU_WORKER_URL.workers.dev/health
```

### Output esperado:
```json
{
  "status": "ok",
  "timestamp": 1704844800000
}
```

### Test 2: En la App

```bash
# Reiniciar servidor de desarrollo
npm run dev
```

1. Abrir app en navegador
2. Generar un video
3. Verificar en consola:

```
🚀 [Worker] Generando borrador via Cloudflare Worker...
✅ [Worker] Respuesta recibida: {...}
```

### ✅ Listo cuando:
- Health check responde "ok"
- Consola muestra "[Worker]" en los logs
- Video se genera correctamente

---

## 🌐 Paso 7: Deploy a Producción (2 min)

### Opción A: Netlify Dashboard

1. Ir a https://app.netlify.com
2. Tu sitio → Site settings → Environment variables
3. Agregar:
   ```
   REACT_APP_USE_VIDEO_WORKER = true
   REACT_APP_VIDEO_WORKER_URL = https://TU_WORKER_URL.workers.dev
   ```
4. Deploys → Trigger deploy

### Opción B: Netlify CLI

```bash
# Configurar variables
netlify env:set REACT_APP_USE_VIDEO_WORKER true
netlify env:set REACT_APP_VIDEO_WORKER_URL https://TU_WORKER_URL.workers.dev

# Deploy
npm run build
netlify deploy --prod
```

### ✅ Listo cuando:
- Variables configuradas en Netlify
- Deploy completado
- App en producción usa Worker

---

## 🎉 ¡Completado!

### Verificar que funciona:

1. Abrir app en producción
2. Abrir DevTools (F12)
3. Ir a Console
4. Generar un video
5. Buscar logs con "[Worker]"

### Deberías ver:
```
🚀 [Worker] Generando borrador via Cloudflare Worker...
📝 [Worker] Prompt: ...
📐 [Worker] Aspect Ratio: 9:16
✅ [Worker] Respuesta recibida: {...}
```

### Beneficios activos:
✅ 60-70% menos latencia  
✅ 0ms cold start  
✅ Edge global  
✅ 3M requests/mes gratis  

---

## 📊 Monitoreo

### Ver logs en tiempo real:
```bash
wrangler tail
```

### Dashboard de Cloudflare:
1. https://dash.cloudflare.com
2. Workers & Pages
3. estudio56-video-worker
4. Ver métricas

---

## 🔙 Rollback (Si algo sale mal)

### Volver a Netlify Functions:

```bash
# En .env.local
REACT_APP_USE_VIDEO_WORKER=false
```

O simplemente eliminar las variables:
```bash
# Eliminar estas líneas de .env.local
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=...
```

Reiniciar:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### Error: "wrangler: command not found"
```bash
npm install -g wrangler
```

### Error: "Not logged in"
```bash
wrangler login
```

### Error: "Secret not found"
```bash
cd cloudflare-workers
wrangler secret put FAL_AI_API_KEY
```

### Worker no responde
```bash
# Ver logs
wrangler tail

# Re-deploy
wrangler deploy
```

### Videos siguen usando Netlify
- Verificar `.env.local` tiene las variables
- Reiniciar servidor: `npm run dev`
- Verificar consola muestra "[Worker]"

---

## 📚 Documentación Adicional

- **Guía completa**: `GUIA-DEPLOY-CLOUDFLARE-WORKER.md`
- **Comandos rápidos**: `COMANDOS-RAPIDOS-WORKER.md`
- **Comparación**: `COMPARACION-WORKER-VS-NETLIFY.md`
- **Setup técnico**: `CLOUDFLARE-WORKER-VIDEO-SETUP.md`

---

## ✅ Checklist Final

```
[✓] Wrangler instalado
[✓] Login a Cloudflare
[✓] API Key configurada
[✓] Worker deployado
[✓] URL copiada
[✓] .env.local configurado
[✓] Health check OK
[✓] Test en desarrollo OK
[✓] Variables en Netlify
[✓] Deploy a producción
[✓] Verificación en producción
```

---

**¡Felicitaciones!** 🎉

Tu sistema ahora usa Cloudflare Worker con:
- 60-70% menos latencia ⚡
- Edge global 🌍
- 3M requests/mes gratis 💰
- 0ms cold start 🚀

**Tiempo total**: ~15 minutos  
**Resultado**: Mejor UX sin costo adicional
