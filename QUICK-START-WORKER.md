# ⚡ Quick Start: Cloudflare Worker

**Tiempo**: 15 minutos | **Dificultad**: Fácil | **Costo**: $0

---

## 🚀 4 Comandos para Deploy

```bash
# 1. Instalar + Login
npm install -g wrangler && wrangler login

# 2. Configurar API Key
cd cloudflare-workers && wrangler secret put FAL_AI_API_KEY

# 3. Deploy
wrangler deploy

# 4. Copiar URL que te da
```

---

## ⚙️ Configurar React

Editar `.env.local`:

```bash
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://TU_WORKER_URL.workers.dev
```

---

## ✅ Test

```bash
# Health check
curl https://TU_WORKER_URL.workers.dev/health

# Debería responder:
# {"status":"ok","timestamp":...}
```

---

## 🎉 ¡Listo!

Ahora tienes:
- ⚡ 60-70% menos latencia
- 🚀 0ms cold start
- 💰 3M requests/mes gratis

---

## 📚 Más Info

- **Tutorial completo**: `PASO-A-PASO-WORKER.md`
- **Comandos útiles**: `COMANDOS-RAPIDOS-WORKER.md`
- **Comparación**: `COMPARACION-WORKER-VS-NETLIFY.md`

---

## 🔙 Rollback

Si algo sale mal:

```bash
# En .env.local
REACT_APP_USE_VIDEO_WORKER=false
```

Reiniciar: `npm run dev`

---

**¿Dudas?** Ver `PASO-A-PASO-WORKER.md` 📖
