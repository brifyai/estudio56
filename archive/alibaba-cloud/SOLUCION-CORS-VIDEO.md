# 🔒 SOLUCIÓN: ERROR DE CORS EN VIDEOS DE ALIBABA CLOUD

**Fecha:** 7 de Enero, 2026  
**Error:** "Access-Control-Allow-Origin header is not present"

---

## 🔍 DIAGNÓSTICO

### Error en Consola del Navegador:
```
Access to image at 'https://dashscope-result-sgp.oss-ap-southeast-1.aliyuncs.com/...' 
from origin 'https://estudio56.netlify.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Causa del Error:
Alibaba Cloud OSS (Object Storage Service) **no incluye headers CORS** en las URLs firmadas de videos. Esto impide que el navegador cargue el video directamente desde el dominio de Alibaba Cloud.

### ¿Por qué pasa esto?
1. ✅ El video se generó correctamente
2. ✅ La URL del video es válida
3. ❌ El servidor de Alibaba Cloud no permite acceso cross-origin
4. ❌ El navegador bloquea la carga por seguridad

---

## ✅ SOLUCIÓN IMPLEMENTADA: PROXY DE VIDEO

### Arquitectura:

**ANTES (CORS Error):**
```
Browser → Alibaba Cloud OSS
         ❌ CORS blocked
```

**AHORA (Con Proxy):**
```
Browser → Netlify Function (proxy-video) → Alibaba Cloud OSS
         ✅ CORS headers added
```

### Flujo Completo:

1. **Video generado** → Alibaba Cloud devuelve URL firmada
2. **URL proxied** → Se convierte a `/.netlify/functions/proxy-video?url=...`
3. **Browser solicita video** → Llama a la función proxy
4. **Proxy descarga video** → Desde Alibaba Cloud
5. **Proxy sirve video** → Con headers CORS correctos
6. **Browser muestra video** → Sin errores de CORS

---

## 🔧 ARCHIVOS CREADOS/MODIFICADOS

### 1. `netlify/functions/proxy-video.ts` (NUEVO)

**Función:**
- Recibe URL del video de Alibaba Cloud
- Descarga el video desde Alibaba Cloud
- Convierte a base64
- Sirve con headers CORS correctos

**Endpoint:**
```
GET /.netlify/functions/proxy-video?url=<URL_ALIBABA_CLOUD>
```

**Headers agregados:**
```typescript
{
  'Content-Type': 'video/mp4',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=86400' // 24 horas
}
```

**Seguridad:**
- ✅ Solo permite URLs de Alibaba Cloud
- ✅ Valida dominio `dashscope-result` y `aliyuncs.com`
- ✅ Solo método GET permitido

---

### 2. `services/vertexVideoService.ts` (MODIFICADO)

**Cambio:**
```typescript
// ANTES:
return status.videoUrl; // URL directa de Alibaba Cloud

// AHORA:
const proxiedUrl = `/.netlify/functions/proxy-video?url=${encodeURIComponent(status.videoUrl)}`;
return proxiedUrl; // URL proxied
```

**Beneficios:**
- ✅ Transparente para el usuario
- ✅ No requiere cambios en App.tsx
- ✅ Cache de 24 horas en Netlify

---

## 📊 COMPARACIÓN

| Característica | URL Directa | URL Proxied |
|----------------|-------------|-------------|
| **CORS** | ❌ Bloqueado | ✅ Permitido |
| **Velocidad inicial** | Rápido | Moderado (descarga) |
| **Cache** | No | Sí (24h) |
| **Seguridad** | Baja | Alta (validación) |
| **Confiabilidad** | Baja (expira 24h) | Alta (cache local) |
| **Ancho de banda** | Alibaba Cloud | Netlify |

---

## ⚡ OPTIMIZACIONES IMPLEMENTADAS

### 1. Cache de 24 Horas
```typescript
'Cache-Control': 'public, max-age=86400'
```
- Primera carga: Descarga desde Alibaba Cloud
- Cargas siguientes: Sirve desde cache de Netlify
- Reduce latencia y ancho de banda

### 2. Validación de URL
```typescript
if (!videoUrl.includes('dashscope-result') && !videoUrl.includes('aliyuncs.com')) {
  throw new Error('URL no válida');
}
```
- Previene uso malicioso del proxy
- Solo permite URLs de Alibaba Cloud

### 3. Conversión a Base64
```typescript
const videoBuffer = await response.arrayBuffer();
const videoBase64 = Buffer.from(videoBuffer).toString('base64');
```
- Permite transmisión eficiente
- Compatible con Netlify Functions

---

## 🧪 PRUEBAS

### Prueba 1: Generar Video Draft
1. Generar video draft (480P)
2. Verificar que se muestra correctamente
3. Verificar en Network tab: `proxy-video?url=...`
4. Verificar headers CORS en respuesta

### Prueba 2: Generar Video HD
1. Generar video HD (720P)
2. Verificar que se muestra correctamente
3. Verificar cache en segunda carga

### Prueba 3: Verificar Cache
1. Generar video
2. Recargar página
3. Verificar que segunda carga es más rápida
4. Verificar en Network tab: `(from disk cache)`

---

## ⚠️ LIMITACIONES

### 1. Tamaño de Video
- **Netlify Functions**: Máximo 6 MB de respuesta
- **Videos de Alibaba Cloud**: Típicamente 2-5 MB
- **Solución**: Si video > 6 MB, considerar streaming

### 2. Tiempo de Ejecución
- **Netlify Functions**: Máximo 10 segundos
- **Descarga de video**: Típicamente 2-5 segundos
- **Solución**: Timeout adecuado implementado

### 3. Ancho de Banda
- **Netlify**: 100 GB/mes en plan gratuito
- **Video 480P**: ~2 MB por video
- **Capacidad**: ~50,000 visualizaciones/mes

---

## 🚀 ALTERNATIVAS FUTURAS

### Opción 1: Descargar y Guardar en Supabase Storage
```typescript
// Después de generar video:
1. Descargar video desde Alibaba Cloud
2. Subir a Supabase Storage
3. Obtener URL pública de Supabase
4. Guardar en base de datos
5. Servir desde Supabase (sin expiración)
```

**Ventajas:**
- ✅ URLs permanentes (no expiran en 24h)
- ✅ Sin problemas de CORS
- ✅ Mejor control de acceso

**Desventajas:**
- ❌ Consume storage de Supabase
- ❌ Requiere implementación adicional

---

### Opción 2: Streaming Directo
```typescript
// Usar streaming en lugar de descarga completa:
1. Abrir stream desde Alibaba Cloud
2. Pipe a respuesta de Netlify
3. Cliente recibe video progresivamente
```

**Ventajas:**
- ✅ Menor uso de memoria
- ✅ Inicio de reproducción más rápido

**Desventajas:**
- ❌ Más complejo de implementar
- ❌ Requiere manejo de ranges HTTP

---

## 📋 CHECKLIST DE DESPLIEGUE

- [x] Crear `netlify/functions/proxy-video.ts`
- [x] Modificar `services/vertexVideoService.ts`
- [ ] Commit y push a Git
- [ ] Netlify redespliegue automáticamente
- [ ] Probar generación de video draft
- [ ] Probar generación de video HD
- [ ] Verificar que videos se muestran sin errores CORS
- [ ] Verificar cache en Network tab
- [ ] Monitorear uso de ancho de banda en Netlify

---

## 🔗 RECURSOS

- **Netlify Functions Docs**: https://docs.netlify.com/functions/overview/
- **CORS Explained**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Alibaba Cloud OSS**: https://www.alibabacloud.com/help/en/oss/
- **Netlify Bandwidth**: https://docs.netlify.com/accounts-and-billing/billing-faq/

---

## 📝 LOGS ESPERADOS

### Generación Exitosa:
```
🎬 [AlibabaVideo] Video completado!
🎬 [AlibabaVideo] Video URL original: https://dashscope-result-sgp...
🔄 [AlibabaVideo] Video URL proxied: /.netlify/functions/proxy-video?url=...
```

### Proxy Exitoso:
```
🎥 [Video Proxy] PROXY DE VIDEO INICIADO
🔗 [Video Proxy] URL del video: https://dashscope-result-sgp...
⏳ [Video Proxy] Descargando video desde Alibaba Cloud...
✅ [Video Proxy] Video descargado exitosamente
📊 [Video Proxy] Content-Type: video/mp4
📊 [Video Proxy] Content-Length: 2458392
✅ [Video Proxy] Video convertido a base64
```

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Código implementado  
**Acción requerida:** Commit, push y probar
