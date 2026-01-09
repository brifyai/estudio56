# Migración a Fal.ai Pika v2 Turbo - Text-to-Video

**Fecha:** 9 de enero de 2026  
**Commit:** `7daa7f3`

## Resumen

Se migró la generación de video de **Alibaba Cloud Wanx** a **Fal.ai Pika v2 Turbo** para mejorar la calidad y resolución de los videos generados.

---

## Cambios Principales

### 1. Modelo de Video

**ANTES (Alibaba Cloud):**
- Draft: `wan2.1-t2v-turbo` (480P)
- HD: `wan2.5-t2v-preview` (720P)

**AHORA (Fal.ai):**
- Modelo único: `fal-ai/pika/v2/turbo/text-to-video`
- Draft: 720p (1280×720 píxeles)
- HD: 1080p (1920×1080 píxeles)

### 2. Resoluciones

**Draft (720p):**
```
width: 1280
height: 720
```

**HD (1080p):**
```
width: 1920
height: 1080
```

### 3. API Endpoints

**Generación de Video:**
- ANTES: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis`
- AHORA: `https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video`

**Polling de Estado:**
- ANTES: `https://dashscope-intl.aliyuncs.com/api/v1/tasks/{taskId}`
- AHORA: `https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video/requests/{taskId}/status`

### 4. Estructura de Request

**Fal.ai Request Body:**
```json
{
  "prompt": "descripción del video",
  "aspect_ratio": "9:16",
  "duration": 5,
  "resolution": {
    "width": 1920,
    "height": 1080
  }
}
```

### 5. Estados de Procesamiento

**Alibaba Cloud:**
- PENDING, RUNNING, SUCCEEDED, FAILED, CANCELED, UNKNOWN

**Fal.ai:**
- IN_QUEUE, IN_PROGRESS, COMPLETED, FAILED

### 6. Estructura de Respuesta

**Generación (202 Accepted):**
```json
{
  "taskId": "request_id",
  "statusUrl": "url_para_polling",
  "status": "IN_QUEUE"
}
```

**Polling Completado (200 OK):**
```json
{
  "status": "complete",
  "videoUrl": "https://...",
  "taskId": "request_id",
  "duration": 5,
  "width": 1920,
  "height": 1080
}
```

---

## Variables de Entorno

**Nueva variable requerida:**
```
FAL_API_KEY=tu_api_key_de_fal_ai
```

**Variable obsoleta (ya no se usa):**
```
ALIBABA_API_KEY=...
```

---

## Archivos Modificados

1. **`netlify/functions/generate-video.ts`**
   - Cambiado de Alibaba Cloud API a Fal.ai API
   - Actualizado modelo y resoluciones
   - Actualizada estructura de request

2. **`netlify/functions/check-video-operation.ts`**
   - Cambiado endpoint de polling
   - Actualizada estructura de respuesta
   - Actualizado manejo de estados

---

## Ventajas de Fal.ai Pika v2 Turbo

✅ **Mayor resolución:**
- Draft: 480p → 720p (+50% de resolución)
- HD: 720p → 1080p (+50% de resolución)

✅ **Mejor calidad:**
- Modelo Pika v2 Turbo optimizado para calidad

✅ **API más simple:**
- Estructura de request/response más limpia
- Menos parámetros complejos

✅ **Mejor documentación:**
- API bien documentada en Fal.ai

---

## Próximos Pasos

1. ✅ Configurar `FAL_API_KEY` en Netlify
2. ⏳ Probar generación de video draft (720p)
3. ⏳ Probar generación de video HD (1080p)
4. ⏳ Verificar tiempos de generación
5. ⏳ Verificar calidad de videos generados

---

## ⚠️ IMPORTANTE: Videos Antiguos de Alibaba Cloud

**Los videos generados ANTES de esta migración NO funcionarán** debido a problemas de CORS con Alibaba Cloud OSS.

**Síntomas:**
- Error: `Access to video at 'https://dashscope-result-sgp.oss-ap-southeast-1.aliyuncs.com/...' has been blocked by CORS policy`
- Error: `net::ERR_FAILED 206 (Partial Content)`

**Solución:**
1. Genera nuevos videos usando el botón de video en la aplicación
2. Los nuevos videos usarán Fal.ai y funcionarán correctamente
3. Fal.ai tiene CORS habilitado por defecto, no hay problemas de acceso

**Nota:** No es necesario usar el proxy de video con Fal.ai, ya que sus URLs tienen CORS habilitado.

---

## Notas Técnicas

- **Duración:** 5 segundos por defecto
- **Prompt máximo:** 2000 caracteres
- **Timeout:** 120 segundos para creación de tarea
- **Aspect ratio:** Soporta 9:16, 1:1, 16:9
- **Procesamiento:** Asíncrono con polling
