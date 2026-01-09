# 🎬 MODELOS TEXT-TO-VIDEO (T2V) DE ALIBABA CLOUD WANX

**Fecha:** 7 de Enero, 2026  
**Fuente:** Alibaba Cloud Model Studio - Wanx Video Generation

---

## 📊 MODELOS T2V DISPONIBLES

### 1. wan2.2-t2v-plus

**Características:**
- 📐 **Resoluciones**: 480P (832×480), 1080P (1920×1080)
- ⏱️ **Duración**: 5 segundos (fijo)
- 🎯 **Uso**: Videos cortos, previsualizaciones rápidas
- 💰 **Costo**: Económico (modelo básico)
- ⚡ **Velocidad**: Rápido (~1-2 minutos)

**Parámetros:**
```json
{
  "model": "wan2.2-t2v-plus",
  "input": {
    "prompt": "A cat running on grass in slow motion"
  },
  "parameters": {
    "size": "832*480",  // o "1920*1080"
    "duration": 5,
    "prompt_extend": true,
    "watermark": false,
    "seed": 12345
  }
}
```

**Limitaciones:**
- ❌ Solo 5 segundos (no configurable)
- ❌ Solo 2 resoluciones disponibles
- ⚠️ Calidad básica

---

### 2. wan2.5-t2v-preview

**Características:**
- 📐 **Resoluciones**: 480P (832×480), 720P (1280×720), 1080P (1920×1080)
- ⏱️ **Duración**: 5 o 10 segundos
- 🎯 **Uso**: Videos de calidad media, contenido general
- 💰 **Costo**: Medio
- ⚡ **Velocidad**: Moderado (~2-3 minutos)

**Parámetros:**
```json
{
  "model": "wan2.5-t2v-preview",
  "input": {
    "prompt": "Professional Pilates studio with natural lighting"
  },
  "parameters": {
    "size": "1280*720",  // 480P, 720P, o 1080P
    "duration": 10,      // 5 o 10 segundos
    "prompt_extend": true,
    "watermark": false,
    "seed": 12345
  }
}
```

**Ventajas:**
- ✅ 3 resoluciones disponibles
- ✅ Duración configurable (5/10s)
- ✅ Mejor calidad que wan2.2

---

### 3. wan2.6-t2v ⭐ RECOMENDADO

**Características:**
- 📐 **Resoluciones**: 720P (1280×720), 1080P (1920×1080)
- ⏱️ **Duración**: 5, 10, o 15 segundos
- 🎯 **Uso**: Videos profesionales, alta calidad
- 💰 **Costo**: Premium
- ⚡ **Velocidad**: Moderado-Lento (~3-5 minutos)
- 🎬 **Multi-shot**: Soporta múltiples escenas

**Parámetros:**
```json
{
  "model": "wan2.6-t2v",
  "input": {
    "prompt": "A modern gym with people exercising, cinematic lighting, professional video"
  },
  "parameters": {
    "size": "1280*720",  // 720P o 1080P
    "duration": 10,      // 5, 10, o 15 segundos
    "prompt_extend": true,
    "watermark": false,
    "seed": 12345
  }
}
```

**Ventajas:**
- ✅ Mejor calidad visual
- ✅ Hasta 15 segundos
- ✅ Multi-shot (múltiples escenas)
- ✅ Más realista y profesional

---

## 📋 COMPARACIÓN COMPLETA

| Característica | wan2.2-t2v-plus | wan2.5-t2v-preview | wan2.6-t2v ⭐ |
|----------------|-----------------|-------------------|--------------|
| **Resoluciones** | 480P, 1080P | 480P, 720P, 1080P | 720P, 1080P |
| **Duración** | 5s (fijo) | 5s, 10s | 5s, 10s, 15s |
| **Calidad** | Básica | Media | Alta |
| **Multi-shot** | ❌ No | ❌ No | ✅ Sí |
| **Velocidad** | Rápido | Moderado | Moderado-Lento |
| **Costo** | Bajo | Medio | Alto |
| **Uso recomendado** | Pruebas rápidas | Contenido general | Producción profesional |

---

## 🎯 FORMATOS DE RESOLUCIÓN (size)

### Formato Correcto para T2V:
```
"size": "ancho*alto"  // ← Usar asterisco (*), no "x"
```

### Resoluciones Disponibles:

**480P (Baja calidad)**
```json
"size": "832*480"
```
- Modelos: wan2.2-t2v-plus, wan2.5-t2v-preview
- Uso: Pruebas, borradores rápidos

**720P (HD Ready)**
```json
"size": "1280*720"
```
- Modelos: wan2.5-t2v-preview, wan2.6-t2v
- Uso: Contenido web, redes sociales

**1080P (Full HD)**
```json
"size": "1920*1080"
```
- Modelos: wan2.2-t2v-plus, wan2.5-t2v-preview, wan2.6-t2v
- Uso: Producción profesional, TV

---

## 🔧 PARÁMETROS COMUNES

### Obligatorios:
```json
{
  "model": "wan2.6-t2v",           // Modelo a usar
  "input": {
    "prompt": "descripción..."      // Descripción del video
  },
  "parameters": {
    "size": "1280*720",             // Resolución
    "duration": 10                  // Duración en segundos
  }
}
```

### Opcionales:
```json
{
  "parameters": {
    "prompt_extend": true,          // Reescribir prompt con LLM (recomendado)
    "watermark": false,             // Sin marca de agua
    "seed": 12345                   // Semilla para reproducibilidad
  }
}
```

---

## 📝 DIFERENCIAS CON I2V

### TEXT-TO-VIDEO (T2V):
```json
{
  "model": "wan2.6-t2v",
  "input": {
    "prompt": "descripción..."
    // ← NO requiere img_url
  },
  "parameters": {
    "size": "1280*720",             // ← Formato: "ancho*alto"
    "duration": 10
  }
}
```

### IMAGE-TO-VIDEO (I2V):
```json
{
  "model": "wan2.6-i2v",
  "input": {
    "prompt": "descripción...",
    "img_url": "https://..."        // ← Requiere imagen
  },
  "parameters": {
    "resolution": "720P",           // ← Formato: "480P", "720P", "1080P"
    "duration": 10
  }
}
```

**Diferencias clave:**
- T2V usa `size` (formato: "1280*720")
- I2V usa `resolution` (formato: "720P")
- T2V NO requiere `img_url`
- I2V REQUIERE `img_url`

---

## 🎬 EJEMPLOS DE PROMPTS PARA T2V

### Ejemplo 1: Gym/Fitness
```json
{
  "model": "wan2.6-t2v",
  "input": {
    "prompt": "Modern gym interior with people exercising on treadmills and lifting weights, bright natural lighting through large windows, professional fitness center atmosphere, cinematic camera movement, high quality video"
  },
  "parameters": {
    "size": "1280*720",
    "duration": 10,
    "prompt_extend": true
  }
}
```

### Ejemplo 2: Pilates Studio
```json
{
  "model": "wan2.6-t2v",
  "input": {
    "prompt": "Serene Pilates studio with wooden floors and mirrors, instructor guiding a small class on reformer machines, soft natural lighting, calm and peaceful atmosphere, smooth camera pan, wellness center aesthetic"
  },
  "parameters": {
    "size": "1280*720",
    "duration": 10,
    "prompt_extend": true
  }
}
```

### Ejemplo 3: Restaurante
```json
{
  "model": "wan2.6-t2v",
  "input": {
    "prompt": "Elegant restaurant interior with customers dining, warm ambient lighting, chef preparing food in open kitchen, professional culinary atmosphere, cinematic dolly shot, high-end dining experience"
  },
  "parameters": {
    "size": "1280*720",
    "duration": 10,
    "prompt_extend": true
  }
}
```

---

## 🚀 ENDPOINT Y AUTENTICACIÓN

### Endpoint (mismo que I2V):
```
POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis
```

### Headers:
```http
Authorization: Bearer sk-d4d0dc3e27874fd5aeb00a4c741624f5
Content-Type: application/json
X-DashScope-Async: enable
```

### Respuesta:
```json
{
  "output": {
    "task_id": "abc123...",
    "task_status": "PENDING"
  },
  "request_id": "xyz789..."
}
```

---

## 🔄 POLLING DE ESTADO

### Endpoint:
```
GET https://dashscope-intl.aliyuncs.com/api/v1/tasks/{task_id}
```

### Estados posibles:
- `PENDING`: Tarea en cola
- `RUNNING`: Generando video
- `SUCCEEDED`: Video completado
- `FAILED`: Error en generación
- `UNKNOWN`: Tarea expirada (>24h)

### Respuesta exitosa:
```json
{
  "output": {
    "task_status": "SUCCEEDED",
    "video_url": "https://...",
    "submit_time": "2026-01-07T10:00:00Z",
    "end_time": "2026-01-07T10:03:45Z"
  }
}
```

---

## 💡 RECOMENDACIONES

### Para Draft (Borrador):
```json
{
  "model": "wan2.2-t2v-plus",      // Más rápido y económico
  "parameters": {
    "size": "832*480",              // 480P suficiente para preview
    "duration": 5
  }
}
```

### Para HD (Producción):
```json
{
  "model": "wan2.6-t2v",           // Mejor calidad
  "parameters": {
    "size": "1280*720",             // 720P (balance calidad/costo)
    "duration": 10                  // 10s (suficiente para redes sociales)
  }
}
```

### Para Premium (Cliente final):
```json
{
  "model": "wan2.6-t2v",
  "parameters": {
    "size": "1920*1080",            // 1080P Full HD
    "duration": 15                  // 15s máximo
  }
}
```

---

## ⚠️ LIMITACIONES

### Duración máxima:
- wan2.2-t2v-plus: **5s** (fijo)
- wan2.5-t2v-preview: **10s** (máximo)
- wan2.6-t2v: **15s** (máximo)

### Prompt:
- Máximo: **1500 caracteres** (wan2.6-t2v)
- Máximo: **800 caracteres** (wan2.2-t2v-plus)
- Idioma: Inglés (mejor calidad)

### URLs de video:
- Validez: **24 horas**
- Después: Descargar o guardar en storage

---

## 🎯 MODELO RECOMENDADO PARA ESTUDIO 56

### Para tu caso de uso:

**wan2.6-t2v** con:
- 📐 Resolución: **1280×720** (720P)
- ⏱️ Duración: **10 segundos**
- 🎨 Prompt extend: **true**
- 💧 Watermark: **false**

**Razones:**
1. ✅ Mejor calidad visual
2. ✅ Duración adecuada para redes sociales
3. ✅ Balance costo/calidad
4. ✅ Multi-shot para escenas variadas

---

## 📚 DOCUMENTACIÓN OFICIAL

- **Text-to-Video API**: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/
- **Model Studio Console**: https://modelstudio.console.alibabacloud.com/
- **Pricing**: https://www.alibabacloud.com/help/en/model-studio/billing-and-throttling

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Documentación completa de modelos T2V
