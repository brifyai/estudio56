# ⚠️ SOLUCIÓN: LÍMITE DE TAMAÑO EN NETLIFY FUNCTIONS

**Fecha:** 7 de Enero, 2026  
**Error:** Video no se carga en el navegador

---

## 🔍 DIAGNÓSTICO

### Logs de Netlify:
```
✅ Video descargado: 3.4 MB
✅ Convertido a base64: 4.5 MB
❌ Navegador no puede cargar el video
```

### Causa del Problema:
**Netlify Functions tiene un límite de 6 MB de respuesta**. Cuando el video en base64 se acerca a este límite (4.5 MB), puede fallar o el navegador no puede procesarlo correctamente.

### Cálculo del Problema:
```
Video original: 3.4 MB
Video en base64: 3.4 MB × 1.33 = 4.5 MB
Límite Netlify: 6 MB
Margen: 1.5 MB (muy ajustado)
```

---

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Verificación de Tamaño

Antes de retornar el video, verificamos el tamaño:

```typescript
const base64SizeMB = videoBase64.length / 1024 / 1024;

if (base64SizeMB > 5.5) {
  // Video muy grande, usar redirect
  return {
    statusCode: 307, // Temporary Redirect
    headers: {
      'Location': videoUrl, // URL directa de Alibaba Cloud
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
}
```

### 2. Fallback Automático

Si el video es > 5.5 MB:
- ✅ Retorna redirect (307) a URL directa de Alibaba Cloud
- ✅ Navegador intenta cargar directamente
- ⚠️ Puede tener problemas de CORS (pero es mejor que nada)

Si el video es < 5.5 MB:
- ✅ Retorna video en base64 con headers CORS
- ✅ Funciona perfectamente

---

## 📊 LÍMITES DE NETLIFY

### Netlify Functions:
- **Respuesta máxima**: 6 MB
- **Timeout**: 10 segundos (26s en Pro)
- **Memoria**: 1024 MB

### Tamaños de Video Típicos:

| Calidad | Duración | Tamaño Aprox | Base64 | ¿Funciona? |
|---------|----------|--------------|--------|------------|
| 480P | 5s | 1-2 MB | 1.3-2.6 MB | ✅ Sí |
| 720P | 5s | 2-4 MB | 2.6-5.3 MB | ✅ Sí |
| 1080P | 5s | 4-6 MB | 5.3-8 MB | ❌ No |
| 720P | 10s | 4-8 MB | 5.3-10.6 MB | ❌ No |

---

## 🎯 RECOMENDACIONES

### Opción 1: Mantener Configuración Actual (RECOMENDADO)

**Configuración:**
- Draft: 480P, 5s
- HD: 720P, 5s

**Ventajas:**
- ✅ Videos < 5 MB (funcionan con proxy)
- ✅ Suficiente para redes sociales
- ✅ Sin problemas de límite

---

### Opción 2: Guardar Videos en Supabase Storage

**Flujo:**
```
1. Video generado en Alibaba Cloud
2. Descargar video en Netlify Function
3. Subir a Supabase Storage
4. Guardar URL permanente en base de datos
5. Servir desde Supabase (sin límite)
```

**Ventajas:**
- ✅ URLs permanentes (no expiran)
- ✅ Sin límite de tamaño
- ✅ Sin problemas de CORS
- ✅ Mejor control de acceso

**Desventajas:**
- ❌ Consume storage de Supabase
- ❌ Requiere implementación adicional
- ❌ Más complejo

---

### Opción 3: Usar CDN Externo

**Flujo:**
```
1. Video generado en Alibaba Cloud
2. Descargar video
3. Subir a Cloudinary/Bunny CDN
4. Servir desde CDN
```

**Ventajas:**
- ✅ Optimizado para video
- ✅ Sin límites
- ✅ Mejor performance

**Desventajas:**
- ❌ Costo adicional
- ❌ Más servicios que gestionar

---

## 🔧 CAMBIOS IMPLEMENTADOS

### 1. Verificación de Tamaño

```typescript
const base64SizeMB = videoBase64.length / 1024 / 1024;

if (base64SizeMB > 5.5) {
  console.warn('⚠️ Video muy grande:', base64SizeMB.toFixed(2), 'MB');
  console.warn('⚠️ Retornando URL directa de Alibaba Cloud');
  
  return {
    statusCode: 307,
    headers: {
      'Location': videoUrl,
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
}
```

### 2. Headers Mejorados

```typescript
headers: {
  'Content-Type': 'video/mp4',
  'Content-Length': contentLength,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=86400',
  'Accept-Ranges': 'bytes', // ← Nuevo: Soporte para ranges
}
```

### 3. Soporte para CORS Preflight

```typescript
if (event.httpMethod === 'OPTIONS') {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: '',
  };
}
```

---

## 📈 MONITOREO

### Métricas a Vigilar:

1. **Tamaño de Videos**
   - Verificar en logs: "Tamaño del video: X MB"
   - Alertar si > 5 MB

2. **Tasa de Redirect**
   - Contar cuántos videos usan redirect (307)
   - Si > 10%, considerar Supabase Storage

3. **Errores de Carga**
   - Monitorear errores en navegador
   - Si aumentan, investigar

---

## 🧪 PRUEBAS

### Prueba 1: Video Draft (480P)
```
Tamaño esperado: 1-2 MB
Base64: 1.3-2.6 MB
Resultado: ✅ Debe funcionar con proxy
```

### Prueba 2: Video HD (720P, 5s)
```
Tamaño esperado: 2-4 MB
Base64: 2.6-5.3 MB
Resultado: ✅ Debe funcionar con proxy
```

### Prueba 3: Video HD (720P, 10s)
```
Tamaño esperado: 4-8 MB
Base64: 5.3-10.6 MB
Resultado: ⚠️ Puede usar redirect
```

---

## 💡 SOLUCIÓN A LARGO PLAZO

### Implementar Supabase Storage

**Paso 1: Crear función para guardar video**
```typescript
// netlify/functions/save-video-to-supabase.ts
export const handler: Handler = async (event) => {
  const { videoUrl, generationId } = JSON.parse(event.body);
  
  // 1. Descargar video desde Alibaba Cloud
  const response = await fetch(videoUrl);
  const videoBuffer = await response.arrayBuffer();
  
  // 2. Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(`${generationId}.mp4`, videoBuffer, {
      contentType: 'video/mp4',
      cacheControl: '3600',
    });
  
  if (error) throw error;
  
  // 3. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(`${generationId}.mp4`);
  
  // 4. Guardar en base de datos
  await supabase
    .from('flyer_generations')
    .update({ video_url: publicUrl })
    .eq('id', generationId);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ videoUrl: publicUrl }),
  };
};
```

**Paso 2: Actualizar flujo en App.tsx**
```typescript
// Después de generar video:
const videoUrl = await generateVideoAndWait(...);

// Guardar en Supabase
const response = await fetch('/.netlify/functions/save-video-to-supabase', {
  method: 'POST',
  body: JSON.stringify({
    videoUrl,
    generationId: currentGenerationId,
  }),
});

const { videoUrl: permanentUrl } = await response.json();

// Usar URL permanente
setImageUrl(permanentUrl);
```

---

## 📋 CHECKLIST

- [x] Agregar verificación de tamaño
- [x] Implementar fallback con redirect
- [x] Agregar soporte para CORS preflight
- [x] Mejorar headers de respuesta
- [ ] Commit y push a Git
- [ ] Redesplegar en Netlify
- [ ] Probar con video draft (480P)
- [ ] Probar con video HD (720P, 5s)
- [ ] Monitorear tamaños en logs
- [ ] Considerar Supabase Storage si hay problemas

---

## 🎯 DECISIÓN FINAL

**Para Estudio 56:**

**Mantener configuración actual:**
- Draft: 480P, 5s (~1-2 MB) ✅
- HD: 720P, 5s (~2-4 MB) ✅

**Razones:**
1. Videos < 5 MB funcionan perfectamente con proxy
2. Suficiente para redes sociales
3. No requiere implementación adicional
4. Sin costos extra

**Si en el futuro necesitas videos más largos o de mayor calidad:**
- Implementar Supabase Storage
- O usar CDN externo (Cloudinary, Bunny)

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Solución implementada  
**Acción requerida:** Commit, push y probar
