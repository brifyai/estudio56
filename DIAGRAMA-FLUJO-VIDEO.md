# Diagrama de Flujo: Sistema de Video

## 🎬 Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIO ESCRIBE PROMPT                        │
│              "A cowboy walking through town..."                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PASO 1: GENERAR BORRADOR                        │
│                                                                  │
│  Frontend: generateDraftVideo(prompt, { aspectRatio: '9:16' })  │
│      ↓                                                           │
│  Backend: /.netlify/functions/generate-video                    │
│      ↓                                                           │
│  Fal.ai: fal-ai/ltx-2-19b/text-to-video/lora                   │
│      ↓                                                           │
│  Configuración:                                                  │
│    - Resolución: 480p (480x854 para 9:16)                       │
│    - Frames: 121 (5 segundos @ 25fps)                           │
│    - Calidad: low                                               │
│    - Aceleración: full                                          │
│      ↓                                                           │
│  Response: { taskId, statusUrl, status: 'IN_QUEUE' }           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POLLING DE BORRADOR                           │
│                                                                  │
│  Loop cada 5 segundos:                                          │
│    checkVideoStatus(taskId)                                     │
│      ↓                                                           │
│    Estados posibles:                                            │
│      - IN_QUEUE: Esperando en cola                              │
│      - IN_PROGRESS: Generando video                             │
│      - COMPLETED: ✅ Video listo                                │
│      - FAILED: ❌ Error                                         │
│                                                                  │
│  Tiempo estimado: 30-60 segundos                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BORRADOR COMPLETADO (480p)                          │
│                                                                  │
│  videoUrl: "https://v3b.fal.media/files/.../video.mp4"         │
│                                                                  │
│  ┌─────────────────────────────────────────────────┐           │
│  │  [▶️ PREVIEW DEL BORRADOR]                      │           │
│  │                                                  │           │
│  │  480x854 • 2.5s • Low Quality                   │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                  │
│  Opciones:                                                      │
│    [🔄 Regenerar con otro prompt]                              │
│    [✅ Aprobar y generar HD]                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Usuario aprueba
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PASO 2: GENERAR HD                             │
│                                                                  │
│  Frontend: upscaleVideoToHD(borradorUrl)                        │
│      ↓                                                           │
│  Backend: /.netlify/functions/generate-video                    │
│      ↓                                                           │
│  Fal.ai: fal-ai/seedvr/upscale/video                           │
│      ↓                                                           │
│  Configuración:                                                  │
│    - Input: URL del borrador                                    │
│    - Target: 1080p                                              │
│    - Upscale mode: target                                       │
│    - Quality: high                                              │
│      ↓                                                           │
│  Response: { taskId, statusUrl, status: 'IN_QUEUE' }           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     POLLING DE HD                                │
│                                                                  │
│  Loop cada 5 segundos:                                          │
│    checkVideoStatus(taskId)                                     │
│      ↓                                                           │
│    Estados posibles:                                            │
│      - IN_QUEUE: Esperando en cola                              │
│      - IN_PROGRESS: Upscaling video                             │
│      - COMPLETED: ✅ Video HD listo                             │
│      - FAILED: ❌ Error                                         │
│                                                                  │
│  Tiempo estimado: 2-5 minutos                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                VIDEO HD COMPLETADO (1080p)                       │
│                                                                  │
│  videoUrl: "https://v3b.fal.media/files/.../video_hd.mp4"      │
│                                                                  │
│  ┌──────────────────────┬──────────────────────┐               │
│  │  BORRADOR (480p)     │  HD (1080p)          │               │
│  │  ┌────────────────┐  │  ┌────────────────┐  │               │
│  │  │ [▶️ Preview]   │  │  │ [▶️ Final]     │  │               │
│  │  │                │  │  │                │  │               │
│  │  │ 480x854        │  │  │ 1080x1920      │  │               │
│  │  │ Low Quality    │  │  │ High Quality   │  │               │
│  │  └────────────────┘  │  └────────────────┘  │               │
│  └──────────────────────┴──────────────────────┘               │
│                                                                  │
│  Opciones:                                                      │
│    [⬇️ Descargar HD]                                           │
│    [📤 Compartir]                                              │
│    [💾 Guardar en galería]                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│ Frontend │────▶│ Netlify  │────▶│  Fal.ai  │────▶│   CDN    │
│          │     │ Function │     │   API    │     │  (Video) │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                 │                │
     │                │                 │                │
     │  1. Request    │                 │                │
     │  (prompt)      │                 │                │
     │────────────────▶                 │                │
     │                │                 │                │
     │                │  2. Submit      │                │
     │                │  (queue)        │                │
     │                │─────────────────▶                │
     │                │                 │                │
     │                │  3. taskId      │                │
     │                │◀─────────────────                │
     │                │                 │                │
     │  4. taskId     │                 │                │
     │◀────────────────                 │                │
     │                │                 │                │
     │  5. Poll       │                 │                │
     │  (loop)        │                 │                │
     │────────────────▶                 │                │
     │                │                 │                │
     │                │  6. Status      │                │
     │                │─────────────────▶                │
     │                │                 │                │
     │                │  7. Status      │                │
     │                │◀─────────────────                │
     │                │                 │                │
     │  8. Status     │                 │                │
     │◀────────────────                 │                │
     │                │                 │                │
     │  ... (repeat until COMPLETED)    │                │
     │                │                 │                │
     │                │                 │  9. Upload     │
     │                │                 │  (video)       │
     │                │                 │────────────────▶
     │                │                 │                │
     │                │  10. videoUrl   │                │
     │                │◀─────────────────                │
     │                │                 │                │
     │  11. videoUrl  │                 │                │
     │◀────────────────                 │                │
     │                │                 │                │
     │  12. Display   │                 │                │
     │  (video)       │                 │                │
     │                │                 │                │
```

## 📊 Estados del Sistema

```
┌─────────────┐
│  IDLE       │  Usuario escribe prompt
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ GENERATING  │  Generando borrador (30-60s)
│ DRAFT       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ DRAFT_READY │  Mostrando preview
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ GENERATING  │  Upscaling a HD (2-5min)
│ HD          │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ HD_READY    │  Video final listo
└─────────────┘
```

## 💰 Costos por Paso

```
BORRADOR (480p)
├─ Generación: $0.05 - $0.10
└─ Tiempo: 30-60s
   Total: ~$0.08

HD (1080p)
├─ Upscale: $0.15 - $0.25
└─ Tiempo: 2-5min
   Total: ~$0.20

TOTAL COMPLETO: $0.20 - $0.35
```

## ⚡ Optimizaciones

```
BORRADOR (Velocidad)
├─ video_quality: "low"
├─ acceleration: "full"
├─ num_inference_steps: 30 (reducido)
├─ use_multiscale: false
├─ generate_audio: false
└─ video_write_mode: "fast"

HD (Calidad)
├─ upscale_mode: "target"
├─ target_resolution: "1080p"
├─ noise_scale: 0.1 (conservador)
├─ output_quality: "high"
└─ output_write_mode: "balanced"
```

## 🎯 Aspect Ratios

```
9:16 (Vertical)
├─ Borrador: 480x854
└─ HD: 1080x1920
   Uso: Stories, TikTok, Reels

16:9 (Horizontal)
├─ Borrador: 854x480
└─ HD: 1920x1080
   Uso: YouTube, landscape

1:1 (Cuadrado)
├─ Borrador: 480x480
└─ HD: 1080x1080
   Uso: Instagram feed
```
