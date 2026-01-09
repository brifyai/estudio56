# ⚡ Comandos Rápidos - Cloudflare Worker

## 🚀 Setup Inicial (Una sola vez)

```bash
# 1. Instalar Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Configurar API Key
cd cloudflare-workers
wrangler secret put FAL_AI_API_KEY
# Pegar tu API key de fal.ai

# 4. Deploy
wrangler deploy
# Copiar la URL que te da
```

## ⚙️ Configurar React App

Editar `.env.local`:

```bash
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://TU_WORKER_URL.workers.dev
```

## 🧪 Testing

```bash
# Health check
curl https://TU_WORKER_URL.workers.dev/health

# Ver logs en tiempo real
wrangler tail

# Test local
wrangler dev
```

## 🔄 Comandos Útiles

```bash
# Ver deployments
wrangler deployments list

# Ver secrets
wrangler secret list

# Actualizar secret
wrangler secret put FAL_AI_API_KEY

# Re-deploy
wrangler deploy

# Ver logs
wrangler tail
```

## 📊 Monitoreo

Dashboard: https://dash.cloudflare.com → Workers & Pages

## 🔙 Rollback

En `.env.local`:
```bash
REACT_APP_USE_VIDEO_WORKER=false
```

---

**¡Eso es todo!** 🎉
