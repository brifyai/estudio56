# Estrategia de Video: Borrador + HD

## 📋 Resumen

Sistema de generación de videos en dos pasos:
1. **BORRADOR (480p)** - Rápido y económico para iteración
2. **HD (1080p)** - Upscale del borrador aprobado

## 🎯 Modelos Utilizados

### Borrador: `fal-ai/ltx-2-19b/text-to-video/lora`
- **Resolución**: 480p (854x480 para 16:9, 480x854 para 9:16)
- **Duración**: 5 segundos (121 frames @ 25fps)
- **Velocidad**: 30-60 segundos
- **Configuración optimizada para velocidad**:
  - `video_quality: "low"`
  - `acceleration: "full"`
  - `num_inference_steps: 30`
  - `use_multiscale: false`
  - `generate_audio: false`
  - `video_write_mode: "fast"`

### HD: `fal-ai/seedvr/upscale/video`
- **Resolución**: 1080p (upscale del borrador)
- **Input**: URL del video borrador
- **Configuración**:
  - `upscale_mode: "target"`
  - `target_resolution: "1080p"`
  - `noise_scale: 0.1` (conservador)
  - `output_quality: "high"`
  - `output_write_mode: "balanced"`

## 🔄 Flujo de Trabajo

```
Usuario escribe prompt
        ↓
Genera BORRADOR (480p)
        ↓
Usuario revisa/modifica
        ↓
Usuario aprueba
        ↓
Upscale a HD (1080p)
        ↓
Video final
```

## 💡 Ventajas

✅ **Borrador rápido** - Usuario puede iterar sin gastar mucho
✅ **Económico** - Borradores en baja calidad son más baratos
✅ **Upscale dedicado** - Modelo especializado en mejorar calidad
✅ **Flexibilidad** - Usuario puede generar múltiples borradores antes de HD
✅ **Mejor UX** - Usuario ve resultado rápido y decide si continuar

## 📐 Aspect Ratios Soportados

### Borrador (480p)
- `9:16` → 480x854 (vertical, stories)
- `16:9` → 854x480 (horizontal, landscape)
- `1:1` → 480x480 (cuadrado)

### HD (1080p)
- Automático según dimensiones del borrador
- Mantiene aspect ratio original

## 🔧 Implementación

### Endpoint: `/.netlify/functions/generate-video`

#### Request para Borrador
```json
{
  "prompt": "A cowboy walking through a dusty town...",
  "quality": "draft",
  "aspectRatio": "9:16"
}
```

#### Response
```json
{
  "taskId": "request_id_123",
  "statusUrl": "https://queue.fal.run/...",
  "status": "IN_QUEUE",
  "quality": "draft"
}
```

#### Request para HD
```json
{
  "quality": "hd",
  "videoUrl": "https://v3b.fal.media/files/.../video.mp4"
}
```

#### Response
```json
{
  "taskId": "request_id_456",
  "statusUrl": "https://queue.fal.run/...",
  "status": "IN_QUEUE",
  "quality": "hd"
}
```

## 📊 Polling de Estado

Usar el mismo endpoint de polling existente:
`/.netlify/functions/check-video-status`

```json
{
  "taskId": "request_id_123"
}
```

Response cuando completo:
```json
{
  "status": "COMPLETED",
  "videoUrl": "https://v3b.fal.media/files/.../video.mp4",
  "seed": 149063119
}
```

## ⚠️ Consideraciones

1. **Timeout**: 
   - Borrador: 120 segundos para submit
   - HD: 180 segundos para submit
   - Polling: Continuar hasta completar

2. **Costos**:
   - Borrador 480p es significativamente más barato
   - HD upscale tiene costo adicional pero menor que generar 1080p directo

3. **Calidad**:
   - Borrador es suficiente para preview y decisión
   - HD mantiene la composición del borrador pero mejora calidad

4. **Errores comunes**:
   - Prompt rechazado por filtros de seguridad
   - Video URL inválida para upscale
   - Timeout en generación (reintentar)

## 🎨 Próximos Pasos

1. Actualizar UI para mostrar flujo de borrador → HD
2. Agregar botón "Generar HD" después de borrador
3. Mostrar comparación lado a lado (borrador vs HD)
4. Implementar sistema de créditos (borrador = 1 crédito, HD = 3 créditos)
5. Agregar opción de regenerar borrador con modificaciones

## 📝 Notas Técnicas

- Ambos modelos usan sistema de cola de fal.ai
- Request devuelve `request_id` inmediatamente
- Polling necesario para obtener resultado final
- Videos se almacenan en CDN de fal.ai
- URLs de video son públicas y permanentes
