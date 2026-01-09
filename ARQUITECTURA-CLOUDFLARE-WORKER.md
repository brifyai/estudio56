# 🏗️ Arquitectura: Cloudflare Worker para Videos

**Sistema**: Proxy para fal.ai Video API  
**Objetivo**: Reducir latencia en 60-70%

---

## 📐 Diagrama de Arquitectura

### Sistema Actual (Netlify Functions)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO EN CHILE                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 200-300ms (CDN)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    REACT APP (Netlify CDN)                       │
│  • App.tsx                                                       │
│  • services/falAiService.ts                                      │
│  • services/videoProgressAlert.ts                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 150-250ms (USA)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              NETLIFY FUNCTIONS (Virginia, USA)                   │
│  • netlify/functions/generate-video.ts                           │
│  • netlify/functions/check-video-status.ts                       │
│  • FAL_AI_API_KEY (env var)                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 150-250ms (USA)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      FAL.AI API (USA)                            │
│  • fal-ai/ltx-2-19b/text-to-video/lora (borrador)                │
│  • fal-ai/seedvr/upscale/video (HD)                              │
└─────────────────────────────────────────────────────────────────┘

LATENCIA TOTAL: 500-1000ms por request
COLD START: 1-3 segundos
```

---

### Sistema Nuevo (Cloudflare Worker)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO EN CHILE                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 200-300ms (CDN)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    REACT APP (Netlify CDN)                       │
│  • App.tsx                                                       │
│  • services/falAiVideoWorkerService.ts                           │
│  • services/videoProgressAlert.ts                                │
│  • REACT_APP_USE_VIDEO_WORKER=true                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 50-100ms (Edge)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         CLOUDFLARE WORKER (Edge - Santiago/São Paulo)            │
│  • cloudflare-workers/video-worker.js                            │
│  • FAL_AI_API_KEY (secret)                                       │
│  • Endpoints:                                                    │
│    - /generate-draft                                             │
│    - /generate-hd                                                │
│    - /check-status                                               │
│    - /health                                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 100-150ms (optimizado)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      FAL.AI API (USA)                            │
│  • fal-ai/ltx-2-19b/text-to-video/lora (borrador)                │
│  • fal-ai/seedvr/upscale/video (HD)                              │
└─────────────────────────────────────────────────────────────────┘

LATENCIA TOTAL: 100-300ms por request (60-70% más rápido)
COLD START: 0ms (siempre caliente)
```

---

## 🔄 Flujo de Datos

### 1. Generar Borrador (480p)

```
Usuario click "Generar Video"
    ↓
App.tsx: generateDraftVideo(prompt)
    ↓
videoProgressAlert detecta: USE_CLOUDFLARE_WORKER=true
    ↓
falAiVideoWorkerService.generateDraftVideoViaWorker()
    ↓
POST https://worker-url.workers.dev/generate-draft
    Body: { prompt, aspectRatio }
    ↓
Cloudflare Worker recibe request
    ↓
Worker valida y prepara payload
    ↓
Worker → fal.ai API
    POST https://queue.fal.run/fal-ai/ltx-2-19b/text-to-video/lora
    Headers: Authorization: Key ${FAL_AI_API_KEY}
    Body: { prompt, video_size, num_frames: 121, ... }
    ↓
fal.ai responde con taskId
    ↓
Worker → React App
    Response: { success: true, taskId, status: "IN_QUEUE" }
    ↓
showVideoProgressAlert inicia polling
    ↓
Cada 5 segundos:
    checkVideoStatusViaWorker(taskId)
    ↓
    POST https://worker-url.workers.dev/check-status
    Body: { taskId, model: "draft" }
    ↓
    Worker → fal.ai API
    GET https://queue.fal.run/.../requests/${taskId}/status
    ↓
    fal.ai responde: IN_QUEUE | IN_PROGRESS | COMPLETED
    ↓
    Worker → React App
    Response: { status, videoUrl? }
    ↓
    videoProgressAlert actualiza progreso
    ↓
Cuando status === "COMPLETED":
    ↓
    videoProgressAlert cierra
    ↓
    onComplete(videoUrl)
    ↓
    App.tsx: setDraftVideoUrl(videoUrl)
    ↓
    Video listo para reproducir
```

---

### 2. Generar HD (1080p)

```
Usuario click "Generar HD"
    ↓
App.tsx: upscaleVideoToHD(draftVideoUrl)
    ↓
videoProgressAlert detecta: USE_CLOUDFLARE_WORKER=true
    ↓
falAiVideoWorkerService.upscaleVideoToHDViaWorker()
    ↓
POST https://worker-url.workers.dev/generate-hd
    Body: { videoUrl: draftVideoUrl }
    ↓
Cloudflare Worker recibe request
    ↓
Worker valida y prepara payload
    ↓
Worker → fal.ai API
    POST https://queue.fal.run/fal-ai/seedvr/upscale/video
    Headers: Authorization: Key ${FAL_AI_API_KEY}
    Body: { video_url, target_resolution: "1080p", ... }
    ↓
fal.ai responde con taskId
    ↓
Worker → React App
    Response: { success: true, taskId, status: "IN_QUEUE" }
    ↓
showVideoProgressAlert inicia polling (igual que borrador)
    ↓
Cuando status === "COMPLETED":
    ↓
    App.tsx: setHdVideoUrl(videoUrl)
    ↓
    Video HD listo para reproducir
```

---

## 🌍 Edge Locations

### Cloudflare Edge Network

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (300+ ciudades)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  América del Sur:                                                │
│  • Santiago, Chile (más cercano a usuarios)                     │
│  • São Paulo, Brasil                                             │
│  • Buenos Aires, Argentina                                       │
│                                                                  │
│  América del Norte:                                              │
│  • Los Angeles, USA                                              │
│  • Miami, USA                                                    │
│  • Ciudad de México, México                                      │
│                                                                  │
│  Europa:                                                         │
│  • Madrid, España                                                │
│  • Londres, UK                                                   │
│  • Frankfurt, Alemania                                           │
│                                                                  │
│  Asia:                                                           │
│  • Tokio, Japón                                                  │
│  • Singapur                                                      │
│  • Hong Kong                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Usuario conecta automáticamente al Edge más cercano
```

---

## 🔒 Seguridad

### API Key Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DESARROLLADOR                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ wrangler secret put FAL_AI_API_KEY
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE SECRETS                            │
│  • Encriptado en reposo                                          │
│  • Solo accesible por Worker                                     │
│  • No visible en código                                          │
│  • No visible en logs                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ env.FAL_AI_API_KEY
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE WORKER                             │
│  • Lee secret en runtime                                         │
│  • Usa en headers a fal.ai                                       │
│  • Nunca expone al cliente                                       │
└─────────────────────────────────────────────────────────────────┘

✅ API Key NUNCA llega al navegador del usuario
✅ API Key NUNCA está en código fuente
✅ API Key NUNCA está en variables de entorno públicas
```

---

## 📊 Comparación de Latencia

### Request: Generar Borrador

```
NETLIFY FUNCTIONS:
┌──────────┐  500ms   ┌──────────┐  200ms   ┌──────────┐
│  React   │ ──────→  │ Netlify  │ ──────→  │  fal.ai  │
│   App    │          │ Function │          │   API    │
└──────────┘  ←──────  └──────────┘  ←──────  └──────────┘
              500ms                  200ms
TOTAL: 1400ms

CLOUDFLARE WORKER:
┌──────────┐  150ms   ┌──────────┐  100ms   ┌──────────┐
│  React   │ ──────→  │   Edge   │ ──────→  │  fal.ai  │
│   App    │          │  Worker  │          │   API    │
└──────────┘  ←──────  └──────────┘  ←──────  └──────────┘
              150ms                  100ms
TOTAL: 500ms

MEJORA: 900ms más rápido (64% reducción)
```

---

### Request: Consultar Estado (Polling)

```
NETLIFY FUNCTIONS:
┌──────────┐  500ms   ┌──────────┐  200ms   ┌──────────┐
│  React   │ ──────→  │ Netlify  │ ──────→  │  fal.ai  │
│   App    │          │ Function │          │   API    │
└──────────┘  ←──────  └──────────┘  ←──────  └──────────┘
              500ms                  200ms
TOTAL: 1400ms × 15 requests = 21 segundos

CLOUDFLARE WORKER:
┌──────────┐  150ms   ┌──────────┐  100ms   ┌──────────┐
│  React   │ ──────→  │   Edge   │ ──────→  │  fal.ai  │
│   App    │          │  Worker  │          │   API    │
└──────────┘  ←──────  └──────────┘  ←──────  └──────────┘
              150ms                  100ms
TOTAL: 500ms × 15 requests = 7.5 segundos

MEJORA: 13.5 segundos más rápido (64% reducción)
```

---

## 💰 Costos por Request

### Netlify Functions

```
Request → Netlify Function → fal.ai
         ↓
    Consume 1 request
    de 125,000/mes (free)
         ↓
    Costo: $0.00 (dentro de free tier)
```

### Cloudflare Worker

```
Request → Cloudflare Worker → fal.ai
         ↓
    Consume 1 request
    de 3,000,000/mes (free)
         ↓
    Costo: $0.00 (dentro de free tier)
```

**Ventaja**: 24x más requests gratis con Worker

---

## 🔄 Rollback Strategy

### Arquitectura Híbrida (Ambos Activos)

```
┌─────────────────────────────────────────────────────────────────┐
│                         REACT APP                                │
│                                                                  │
│  if (REACT_APP_USE_VIDEO_WORKER === 'true') {                   │
│    // Usar Cloudflare Worker                                    │
│    await checkVideoStatusViaWorker(taskId);                      │
│  } else {                                                        │
│    // Usar Netlify Functions (backup)                           │
│    await checkVideoStatus(taskId);                               │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ↓                         ↓
    ┌───────────────────┐     ┌───────────────────┐
    │ Cloudflare Worker │     │ Netlify Functions │
    │   (Primario)      │     │    (Backup)       │
    └───────────────────┘     └───────────────────┘
                │                         │
                └────────────┬────────────┘
                             ↓
                    ┌─────────────────┐
                    │   fal.ai API    │
                    └─────────────────┘

Rollback: Cambiar variable de entorno (1 minuto)
```

---

## 📈 Escalabilidad

### Tráfico Creciente

```
NETLIFY FUNCTIONS:
┌─────────────────────────────────────────────────────────────────┐
│  Requests/mes  │  Plan      │  Costo/mes  │  Límite             │
├────────────────┼────────────┼─────────────┼─────────────────────┤
│  0 - 125k      │  Free      │  $0         │  ✅ OK              │
│  125k - 2M     │  Pro       │  $19        │  ⚠️ Upgrade needed  │
│  2M+           │  Business  │  $99+       │  ⚠️ Expensive       │
└─────────────────────────────────────────────────────────────────┘

CLOUDFLARE WORKER:
┌─────────────────────────────────────────────────────────────────┐
│  Requests/mes  │  Plan      │  Costo/mes  │  Límite             │
├────────────────┼────────────┼─────────────┼─────────────────────┤
│  0 - 3M        │  Free      │  $0         │  ✅ OK              │
│  3M - 10M      │  Paid      │  $5         │  ✅ Affordable      │
│  10M+          │  Paid      │  $5 + $0.50 │  ✅ Scalable        │
│                │            │  per 1M     │                     │
└─────────────────────────────────────────────────────────────────┘

Ventaja: Worker escala mejor y más barato
```

---

## 🎯 Conclusión

### Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCCIÓN                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Primario:  Cloudflare Worker (60-70% más rápido)               │
│  Backup:    Netlify Functions (rollback en 1 minuto)            │
│  Costo:     $0 (ambos en free tier)                             │
│  Riesgo:    Bajo (fácil rollback)                               │
│  Beneficio: Mejor UX sin costo adicional                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Sistema listo para deploy** 🚀

Ver `QUICK-START-WORKER.md` para empezar.
