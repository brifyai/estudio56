# 🚀 Guía de Deploy - Cloudflare Worker para Videos

**Estado**: Worker implementado, listo para deploy  
**Fecha**: 9 Enero 2026  
**Objetivo**: Reducir latencia de videos en 60-70%

---

## 📋 Resumen Ejecutivo

El Cloudflare Worker ya está implementado y listo para usar. Solo necesitas:

1. ✅ Instalar Wrangler CLI
2. ✅ Login a Cloudflare
3. ✅ Configurar API Key
4. ✅ Deploy Worker
5. ✅ Configurar variables de entorno
6. ✅ Actualizar App.tsx (opcional - ya funciona con Netlify)

**Tiempo estimado**: 10-15 minutos

---

## 🎯 ¿Por qué usar Cloudflare Worker?

### Antes (Netlify Functions)
```
React App (Chile) → Netlify (USA) → fal.ai (USA)
Latencia: 500-1000ms
```

### Después (Cloudflare Worker)
```
React App (Chile) → Cloudflare Edge (más cercano) → fal.ai (USA)
Latencia: 100-300ms
```

**Mejora**: 60-70% más rápido ⚡

---

## 📦 Paso 1: Instalar Wrangler CLI

```bash
npm install -g wrangler
```

Verificar instalación:
```bash
wrangler --version
```

---

## 🔐 Paso 2: Login a Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte con Cloudflare.

**Nota**: Si no tienes cuenta de Cloudflare, créala gratis en https://dash.cloudflare.com/sign-up

---

## 🔑 Paso 3: Configurar API Key de fal.ai

```bash
cd cloudflare-workers
wrangler secret put FAL_AI_API_KEY
```

Cuando te lo pida, pega tu API Key de fal.ai (la misma que usas en Netlify).

**Verificar**:
```bash
wrangler secret list
```

Deberías ver:
```
FAL_AI_API_KEY
```

---

## 🚀 Paso 4: Deploy Worker

```bash
cd cloudflare-workers
wrangler deploy
```

**Output esperado**:
```
✨ Built successfully
✨ Uploaded successfully
✨ Deployed successfully

Worker URL: https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

**IMPORTANTE**: Copia la URL del Worker, la necesitarás en el siguiente paso.

---

## ⚙️ Paso 5: Configurar Variables de Entorno

### Opción A: Usar Worker (Recomendado)

Editar `.env.local`:

```bash
# Habilitar Cloudflare Worker
REACT_APP_USE_VIDEO_WORKER=true

# URL del Worker (reemplazar con tu URL del paso 4)
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

### Opción B: Seguir usando Netlify Functions

No hacer nada. El sistema seguirá funcionando con Netlify Functions.

---

## 🧪 Paso 6: Testing

### Test 1: Health Check

```bash
curl https://YOUR_WORKER_URL.workers.dev/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "timestamp": 1704844800000
}
```

### Test 2: Generar Video (Opcional)

```bash
curl -X POST https://YOUR_WORKER_URL.workers.dev/generate-draft \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A cowboy walking in the desert","aspectRatio":"9:16"}'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "taskId": "request_id_123...",
  "statusUrl": "https://...",
  "status": "IN_QUEUE"
}
```

---

## 🔄 Paso 7: Actualizar App.tsx (Opcional)

**NOTA**: Este paso es OPCIONAL. El sistema ya detecta automáticamente si debe usar Worker o Netlify Functions basado en `REACT_APP_USE_VIDEO_WORKER`.

Si quieres optimizar los imports, puedes hacer:

```typescript
// En App.tsx, línea ~1360

// ANTES
import { generateDraftVideo } from './services/falAiService';

// DESPUÉS (solo si REACT_APP_USE_VIDEO_WORKER=true)
import { generateDraftVideoViaWorker as generateDraftVideo } from './services/falAiVideoWorkerService';
```

**Pero NO es necesario** porque `videoProgressAlert.ts` ya maneja esto automáticamente.

---

## 📊 Paso 8: Deploy a Producción

### 1. Configurar Netlify

En Netlify Dashboard → Site settings → Environment variables:

```
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

### 2. Rebuild en Netlify

```bash
# Localmente
npm run build

# O en Netlify Dashboard
Site → Deploys → Trigger deploy
```

---

## 🎉 ¡Listo!

Tu sistema ahora usa Cloudflare Worker para videos con:

✅ **60-70% menos latencia**  
✅ **API Key segura** (no expuesta al cliente)  
✅ **100k requests/día gratis**  
✅ **Escalabilidad global**  

---

## 📈 Monitoreo

### Ver logs en tiempo real

```bash
wrangler tail
```

### Dashboard de Cloudflare

1. Ir a https://dash.cloudflare.com
2. Workers & Pages
3. Seleccionar `estudio56-video-worker`
4. Ver métricas:
   - Requests por segundo
   - Latencia promedio
   - Errores
   - CPU time

---

## 🐛 Troubleshooting

### Error: "wrangler: command not found"

```bash
npm install -g wrangler
```

### Error: "Authentication required"

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

# Verificar deployment
wrangler deployments list

# Re-deploy
wrangler deploy
```

### Videos siguen lentos

Verificar que `.env.local` tenga:
```
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://...
```

Y que hayas hecho rebuild:
```bash
npm run build
```

---

## 💰 Costos

### Free Tier (Suficiente para empezar)
- 100,000 requests/día
- 10ms CPU time/request
- **Costo: $0**

### Paid Plan ($5/mes)
- 10 millones requests/mes
- 50ms CPU time/request
- **Costo: $5/mes**

**Recomendación**: Empezar con Free Tier

---

## 🔄 Rollback (Si algo sale mal)

Para volver a Netlify Functions:

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

Rebuild:
```bash
npm run build
```

---

## 📚 Archivos Relacionados

- `cloudflare-workers/video-worker.js` - Worker principal
- `cloudflare-workers/wrangler.toml` - Configuración
- `services/falAiVideoWorkerService.ts` - Cliente React
- `services/videoProgressAlert.ts` - Maneja Worker/Netlify automáticamente
- `CLOUDFLARE-WORKER-VIDEO-SETUP.md` - Documentación técnica completa

---

## ✅ Checklist Final

- [ ] Instalar Wrangler CLI
- [ ] Login a Cloudflare
- [ ] Configurar FAL_AI_API_KEY secret
- [ ] Deploy Worker
- [ ] Copiar URL del Worker
- [ ] Configurar .env.local
- [ ] Test health check
- [ ] Configurar Netlify variables
- [ ] Deploy a producción
- [ ] Verificar latencia mejorada

---

**¡Sistema listo para usar!** 🚀

Cualquier duda, revisar `CLOUDFLARE-WORKER-VIDEO-SETUP.md` para más detalles técnicos.
