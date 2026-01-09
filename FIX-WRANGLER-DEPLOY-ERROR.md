# ✅ Fix: Error de Wrangler Deploy

**Error**: `Missing entry-point to Worker script`

**Causa**: Ejecutaste `wrangler deploy` desde la carpeta raíz en lugar de `cloudflare-workers/`

---

## 🔧 Solución

### Opción 1: Navegar a la carpeta correcta

```bash
cd cloudflare-workers
wrangler deploy
```

### Opción 2: Especificar el archivo desde raíz

```bash
wrangler deploy cloudflare-workers/video-worker.js --config cloudflare-workers/wrangler.toml
```

---

## ✅ Pasos Correctos

```bash
# 1. Ir a la carpeta del worker
cd cloudflare-workers

# 2. Configurar API Key (solo primera vez)
wrangler secret put FAL_AI_API_KEY
# Pegar tu FAL_AI_API_KEY cuando te lo pida

# 3. Deploy
wrangler deploy

# 4. Copiar la URL que te da
# Ejemplo: https://estudio56-video-worker.tu-subdomain.workers.dev
```

---

## 📝 Resultado Esperado

Después de `wrangler deploy` deberías ver:

```
✨ Successfully published your Worker
🌍 https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

Copia esa URL y úsala en tu `.env.local`:

```bash
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.YOUR_SUBDOMAIN.workers.dev
```

---

**Siguiente paso**: Ejecuta los comandos desde `cloudflare-workers/` 🚀
